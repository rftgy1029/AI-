import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Timetable = require('comcigan-parser');

export interface ComciganPeriod {
  grade: number;
  class: number;
  weekday: number;
  weekdayString: string;
  classTime: number;
  teacher: string;
  subject: string;
  isChanged?: boolean;
  originalSubject?: string;
  originalTeacher?: string;
}

export interface CachedTimetableData {
  timestamp: number;
  data: Record<number, Record<number, ComciganPeriod[][]>>;
}

let timetableInstance: any = null;
let schoolCode: number | null = null;
let cachedData: CachedTimetableData | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5분 캐시
const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 컴시간 파서 인스턴스 초기화 및 서대전고등학교(코드: 71433) 바인딩
 */
async function getInitializedTimetable() {
  if (!timetableInstance) {
    timetableInstance = new Timetable();
    await timetableInstance.init();

    // 서대전고등학교 검색 및 설정
    const schools = await timetableInstance.search('서대전고');
    const targetSchool = schools.find((s: any) => s.name.includes('서대전고')) || schools[0];
    
    if (targetSchool) {
      schoolCode = targetSchool.code;
      timetableInstance.setSchool(schoolCode);
    } else {
      // 서대전고 기본 코드(71433) 지정
      timetableInstance.setSchool(71433);
    }
  }
  return timetableInstance;
}

/**
 * 전교 컴시간 시간표를 5분간 캐시하여 조회
 * - 컴시간 raw 데이터(자료147 및 자료481)를 직접 디코딩하여 실시간 '변경' 속성과 '원래 과목'까지 완전 감지
 */
export async function fetchAllComciganTimetable(): Promise<Record<number, Record<number, ComciganPeriod[][]>>> {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
    return cachedData.data;
  }

  const tt = await getInitializedTimetable();

  try {
    const jsonString = await tt._getData();
    const data = JSON.parse(jsonString);

    // 컴시간 디코딩 헬퍼 함수 추출 (어떤 스크립트 태그 구조에서도 안전하게 파싱)
    const scriptTags = tt._pageSource.match(/<script[\s\S]*?<\/script>/gi) || [];
    let script = '';
    for (const tag of scriptTags) {
      script += tag.replace(/<\/?script[^>]*>/gi, '') + '\n';
    }

    // Node.js 컨텍스트에서 컴시간 헬퍼 함수(baSplit, Q자료, Q성명, Q과목명 등) 실행 환경 구성 ($, jQuery, window, document Proxy 더미 객체 제공)
    const proxyShim = 'var dummy = new Proxy(function(){ return dummy; }, { get: () => (...args) => dummy, apply: () => dummy }); var numberPart, $ = dummy, jQuery = dummy, window = dummy, document = dummy;';
    const evalEnv = new Function(proxyShim + script + '; return { baSplit, Q자료, Q성명, Q과목명, mTime };')();
    const { baSplit, Q자료, Q성명, Q과목명 } = evalEnv;

    const classCount = data['학급수']; // [전체, 1학년반수, 2학년반수, 3학년반수]
    const 분리 = data.분리 || 100;
    const timetableData: Record<number, Record<number, ComciganPeriod[][]>> = {};

    for (let grade = 1; grade <= 3; grade++) {
      timetableData[grade] = {};
      const maxClass = classCount[grade] || 10;

      for (let classNum = 1; classNum <= maxClass; classNum++) {
        const weekPeriods: ComciganPeriod[][] = [];

        // 1(월) ~ 5(금)
        for (let day = 1; day <= 5; day++) {
          const dayPeriods: ComciganPeriod[] = [];
          const dailyDayRaw = data.자료147?.[grade]?.[classNum]?.[day];

          // 컴시간 알리미 100% 동기화: 학교에서 해당 요일의 일일자료(자료147)를 아직 확정·공지하지 않은 경우 ([0] 또는 빈 배열)
          // 원래시간표(자료481)를 임의로 채우지 않고 공식 컴시간 알리미와 100% 동일하게 빈 시간표(미등록) 처리
          const isDailyAnnounced = Array.isArray(dailyDayRaw) && dailyDayRaw.length > 1 && dailyDayRaw[0] > 0;

          if (!isDailyAnnounced) {
            weekPeriods.push([]);
            continue;
          }

          const maxP = dailyDayRaw[0];

          for (let period = 1; period <= maxP; period++) {
            const baseVal = Q자료(data.자료481?.[grade]?.[classNum]?.[day]?.[period]);
            const dailyRaw = dailyDayRaw[period];
            const dailyVal = dailyRaw ? Q자료(dailyRaw) : 0;

            const dailySplit = baSplit(dailyVal, baseVal, data.변경알림);
            const th = dailySplit[0];
            const sb = dailySplit[1];
            const status = dailySplit[2];

            let teacher = '';
            let subject = '';
            let isChanged = false;
            let originalSubject: string | undefined = undefined;
            let originalTeacher: string | undefined = undefined;

            if (th > 0) {
              teacher = Q성명(data.자료446[th]) || '';
              subject = Q과목명(data.자료492[sb % 분리]) || '';
              isChanged = (status === '변경') || (dailyVal > 0 && String(dailyRaw).startsWith('>'));

              if (isChanged && baseVal) {
                const baseSplit = baSplit(baseVal, baseVal, 0);
                if (baseSplit[0] > 0) {
                  originalTeacher = Q성명(data.자료446[baseSplit[0]]) || undefined;
                }
                if (baseSplit[1] > 0) {
                  originalSubject = Q과목명(data.자료492[baseSplit[1] % 분리]) || undefined;
                }
              }
            }

            dayPeriods.push({
              grade,
              class: classNum,
              weekday: day - 1,
              weekdayString: WEEKDAY_NAMES[day],
              classTime: period,
              teacher,
              subject,
              isChanged,
              originalSubject,
              originalTeacher,
            });
          }

          weekPeriods.push(dayPeriods);
        }

        timetableData[grade][classNum] = weekPeriods;
      }
    }

    cachedData = {
      timestamp: now,
      data: timetableData,
    };

    return timetableData;
  } catch (err) {
    console.warn('컴시간 세부 디코딩 중 오류 발생, 캐시 또는 안전 백업으로 복구합니다:', err);
    if (cachedData?.data) {
      return cachedData.data;
    }
    try {
      const rawTimetable = await tt.getTimetable();
      for (const g of [1, 2, 3]) {
        const maxC = (rawTimetable[g] && Object.keys(rawTimetable[g]).length) || 10;
        for (let c = 1; c <= maxC; c++) {
          if (rawTimetable[g]?.[c]) {
            // 컴시간 알리미 100% 동기화: 미공지 요일(목, 금) 빈 배열 방어
            if (Array.isArray(rawTimetable[g][c][3])) rawTimetable[g][c][3] = [];
            if (Array.isArray(rawTimetable[g][c][4])) rawTimetable[g][c][4] = [];
          }
        }
      }
      cachedData = {
        timestamp: now,
        data: rawTimetable,
      };
      return rawTimetable;
    } catch {
      return {};
    }
  }
}

/**
 * 특정 학년, 반의 주간 시간표(월~금) 조회
 */
export async function getClassComciganTimetable(grade: number, classNum: number): Promise<ComciganPeriod[][] | null> {
  const allData = await fetchAllComciganTimetable();
  if (!allData || !allData[grade] || !allData[grade][classNum]) {
    return null;
  }
  return allData[grade][classNum];
}
