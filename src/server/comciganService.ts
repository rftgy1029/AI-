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

    // 컴시간 디코딩 헬퍼 함수 추출
    const startTag = tt._pageSource.match(/<script language(.*?)>/gm)[0];
    const regex = new RegExp(startTag + '(.*?)</script>', 'gi');

    let match;
    let script = '';
    while ((match = regex.exec(tt._pageSource))) {
      script += match[1];
    }

    // Node.js 컨텍스트에서 컴시간 헬퍼 함수(baSplit, Q자료, Q성명, Q과목명 등) 실행 환경 구성
    const evalEnv = new Function(script + '; return { baSplit, Q자료, Q성명, Q과목명, mTime };')();
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

          for (let period = 1; period <= 8; period++) {
            const baseVal = Q자료(data.자료481?.[grade]?.[classNum]?.[day]?.[period]);
            const dailyVal = Q자료(data.자료147?.[grade]?.[classNum]?.[day]?.[period]);

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
              isChanged = (status === '변경');

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
    console.warn('컴시간 세부 디코딩 중 오류 발생, 기본 파서로 폴백합니다:', err);
    const rawTimetable = await tt.getTimetable();
    cachedData = {
      timestamp: now,
      data: rawTimetable,
    };
    return rawTimetable;
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
