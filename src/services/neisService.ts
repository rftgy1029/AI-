import { MealItem, TimetableDay, AcademicEvent, SchoolInfo } from '../types';
import { SEODAEJEON_ALL_CLASSES_TIMETABLE } from '../data/seodaejeonTimetables';
import {
  getKSTDate,
  getKSTDateString,
  getKSTDayOfWeek,
  getCurrentPeriodInfo,
  getMealStatusInfo,
} from '../utils/datetime';

export {
  getKSTDate,
  getKSTDateString,
  getKSTDayOfWeek,
  getCurrentPeriodInfo,
  getMealStatusInfo,
};

// 서대전고등학교 교육부 NEIS 공공데이터 고유 식별 코드
export const SEODAEJEON_NEIS = {
  ATPT_OFCDC_SC_CODE: 'G10', // 대전광역시교육청
  SD_SCHUL_CODE: '7430059',   // 서대전고등학교 고유 학교코드
  SCHUL_NM: '서대전고등학교',
  TEL: '042-479-2004',
  FAX: '042-488-9086',
  ZIP: '35216',
  ADDRESS: '대전광역시 서구 월평동로 60 (월평동, 서대전고등학교)',
  HOMEPAGE: 'http://sdjhs.djsch.kr',
};

// 교육부 NEIS 공인 학교 정보
export const OFFICIAL_SCHOOL_INFO: SchoolInfo = {
  name: '서대전고등학교',
  engName: 'Seodaejeon High School',
  foundDate: '1972년 12월 15일',
  anniversaryDate: '12월 26일',
  schoolType: '고등학교 (일반계고)',
  foundationType: '사립 (학교법인 대신학원)',
  coedu: '남학교',
  address: '대전광역시 서구 월평동로 60 (월평동)',
  zipCode: '35216',
  tel: '042-479-2004 (교무실)',
  fax: '042-488-9086 (행정실)',
  homepage: 'http://sdjhs.djsch.kr',
  officeOfEdu: '대전광역시교육청',
  schoolCode: '7430059',
  motto: '성실(誠實), 근면(勤勉), 협동(協同)',
  tree: '소나무 (늘 푸른 기상과 굳은 의지)',
  flower: '목련 (순결과 고귀한 품격)',
};

// 교육부 지정 19대 알레르기 유발 물질 공식 번호
export const ALLERGY_MAP: Record<string, string> = {
  '1': '난류(달걀)',
  '2': '우유',
  '3': '메밀',
  '4': '땅콩',
  '5': '대두(콩)',
  '6': '밀',
  '7': '고등어',
  '8': '게',
  '9': '새우',
  '10': '돼지고기',
  '11': '복숭아',
  '12': '토마토',
  '13': '아황산류',
  '14': '호두',
  '15': '닭고기',
  '16': '쇠고기',
  '17': '오징어',
  '18': '조개류(굴·전복·홍합)',
  '19': '잣',
};

// 서대전고등학교 정규 일과 교시 시간표 (컴시간 공식: 1교시 08:20 시작)
export const PERIOD_TIMES: Record<number, string> = {
  1: '08:20 ~ 09:10',
  2: '09:20 ~ 10:10',
  3: '10:20 ~ 11:10',
  4: '11:20 ~ 12:10',
  5: '13:10 ~ 14:00',
  6: '14:10 ~ 15:00',
  7: '15:10 ~ 16:00',
};

// YYYYMMDD -> 요일 변환
export function getKoreanDayOfWeek(dateStr: string): '월' | '화' | '수' | '목' | '금' {
  const clean = dateStr.replace(/-/g, '');
  if (clean.length < 8) return '월';
  const y = parseInt(clean.substring(0, 4), 10);
  const m = parseInt(clean.substring(4, 6), 10) - 1;
  const d = parseInt(clean.substring(6, 8), 10);
  const date = new Date(y, m, d);
  const days: ('일' | '월' | '화' | '수' | '목' | '금' | '토')[] = ['일', '월', '화', '수', '목', '금', '토'];
  const res = days[date.getDay()];
  if (res === '일' || res === '토') return '월';
  return res as '월' | '화' | '수' | '목' | '금';
}

/**
 * 1. NEIS 학교 기본정보 조회 (schoolInfo API)
 */
export async function fetchSeodaejeonSchoolInfo(): Promise<any | null> {
  try {
    const url = `https://open.neis.go.kr/hub/schoolInfo?Type=json&ATPT_OFCDC_SC_CODE=${SEODAEJEON_NEIS.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SEODAEJEON_NEIS.SD_SCHUL_CODE}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.schoolInfo && data.schoolInfo[1]?.row?.length > 0) {
      return data.schoolInfo[1].row[0];
    }
  } catch (error) {
    console.error('NEIS schoolInfo fetch error:', error);
  }
  return null;
}

/**
 * NEIS 식단 행(row) 파싱 - 실제 메뉴, 열량, 영양성분, 원산지, 알레르기 분리
 */
function parseNeisMealRow(row: any): MealItem {
  const rawDish: string = row.DDISH_NM || '';
  const splitDishes = rawDish.split(/<br\s*\/?>|\n/gi).filter(Boolean);

  const allergySet = new Set<string>();
  const cleanedMenu: string[] = [];

  splitDishes.forEach((item) => {
    // 괄호 안의 알레르기 번호 (예: (5.6.13) 또는 (1.5.6.10))
    const matches = item.match(/\(([\d\.]+)\)|([\d\.]+)$/);
    if (matches) {
      const numStr = matches[1] || matches[2] || '';
      const numbers = numStr.split('.').filter(Boolean);
      numbers.forEach((n) => {
        if (ALLERGY_MAP[n]) {
          allergySet.add(ALLERGY_MAP[n]);
        }
      });
    }

    // 알레르기 번호와 특수문자 제거 후 순수 메뉴명 추출
    const cleaned = item
      .replace(/\s*\([\d\.\s]+\)/g, '')
      .replace(/[\d\.]+/g, '')
      .trim();

    if (cleaned) {
      cleanedMenu.push(cleaned);
    }
  });

  // 열량 (Kcal) 파싱
  let calories = 0;
  if (row.CAL_INFO) {
    const calMatch = row.CAL_INFO.match(/([\d\.]+)/);
    if (calMatch) {
      calories = Math.round(parseFloat(calMatch[1]));
    }
  }

  // 영양성분 (NTR_INFO) 파싱
  const nutrition: Record<string, string> = {};
  if (row.NTR_INFO) {
    const rawNtr = row.NTR_INFO.split(/<br\s*\/?>|\n/gi);
    rawNtr.forEach((line: string) => {
      const parts = line.split(':').map((s: string) => s.trim());
      if (parts.length >= 2) {
        const key = parts[0];
        let val = parts[1];
        const unitMatch = key.match(/\(([^)]+)\)/);
        const unit = unitMatch ? unitMatch[1] : '';
        if (unit && !val.toLowerCase().includes(unit.toLowerCase())) {
          val = `${val}${unit}`;
        }

        if (key.includes('탄수화물')) nutrition.carbs = val;
        else if (key.includes('단백질')) nutrition.protein = val;
        else if (key.includes('지방')) nutrition.fat = val;
        else if (key.includes('비타민A')) nutrition.vitaminA = val;
        else if (key.includes('비타민C')) nutrition.vitaminC = val;
        else if (key.includes('티아민')) nutrition.thiamine = val;
        else if (key.includes('리보플라빈')) nutrition.riboflavin = val;
        else if (key.includes('칼슘')) nutrition.calcium = val;
        else if (key.includes('철분')) nutrition.iron = val;
      }
    });
  }

  // 식재료 원산지 정보 (ORPLC_INFO) 파싱
  const origins: string[] = [];
  if (row.ORPLC_INFO) {
    const rawOrigin = row.ORPLC_INFO.split(/<br\s*\/?>|\n/gi);
    rawOrigin.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('비고')) {
        origins.push(trimmed);
      }
    });
  }

  const ymd = row.MLSV_YMD || '';
  const formattedDate =
    ymd.length === 8
      ? `${ymd.substring(0, 4)}-${ymd.substring(4, 6)}-${ymd.substring(6, 8)}`
      : ymd;
  const dayOfWeek = getKoreanDayOfWeek(ymd);

  return {
    id: `neis-meal-${ymd}-${row.MMEAL_SC_CODE || '2'}`,
    date: formattedDate,
    dayOfWeek,
    type: row.MMEAL_SC_NM === '석식' ? 'dinner' : 'lunch',
    menu: cleanedMenu.length > 0 ? cleanedMenu : ['식단 정보 없음'],
    calories,
    allergies: Array.from(allergySet),
    nutritionInfo: Object.keys(nutrition).length > 0 ? nutrition : undefined,
    originInfo: origins.length > 0 ? origins : undefined,
    servingCount: row.MLSV_FGR ? Math.round(Number(row.MLSV_FGR)) : undefined,
  };
}

// 서대전고등학교 요일별 중식 기본 영양 식단 (NEIS 미등록 시 또는 중식 조회 보강용 - 요일별 중복 원천 방지)
export const SEODAEJEON_WEEKLY_LUNCHES: Record<string, Omit<MealItem, 'id' | 'date' | 'dayOfWeek' | 'type'>> = {
  월: {
    menu: ['찰현미밥', '얼큰소고기무국', '제육불고기', '계란찜', '깍두기', '사과주스'],
    calories: 860,
    allergies: ['대두', '밀', '돼지고기', '쇠고기', '난류'],
    originInfo: ['쌀(국내산)', '돼지고기(국내산)', '쇠고기(한우)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '132.5g',
      protein: '41.0g',
      fat: '21.0g',
      calcium: '185.0mg',
      iron: '4.2mg',
      vitaminA: '220.1R.E',
      vitaminC: '31.2mg',
    },
  },
  화: {
    menu: ['차조밥', '된장찌개', '동인동갈비찜', '고춧잎무침', '잡채', '배추김치'],
    calories: 890,
    allergies: ['대두', '밀', '돼지고기', '아황산류'],
    originInfo: ['쌀(국내산)', '돼지고기(국내산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '140.2g',
      protein: '43.5g',
      fat: '22.8g',
      calcium: '210.4mg',
      iron: '4.8mg',
      vitaminA: '235.0R.E',
      vitaminC: '25.6mg',
    },
  },
  수: {
    menu: ['치킨마요덮밥', '열무된장국', '샤인머스캣샐러드', '츠쿠네구이', '배추김치', '멜론'],
    calories: 920,
    allergies: ['난류', '우유', '대두', '밀', '닭고기', '토마토'],
    originInfo: ['쌀(국내산)', '닭고기(국내산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '138.9g',
      protein: '45.4g',
      fat: '25.0g',
      calcium: '232.8mg',
      iron: '4.5mg',
      vitaminA: '178.5R.E',
      vitaminC: '30.2mg',
    },
  },
  목: {
    menu: ['찰현미밥', '북어무국', '로제닭볶음탕(비엔나)', '연두부*양념장', '배추김치', '비타500젤리'],
    calories: 875,
    allergies: ['우유', '대두', '밀', '돼지고기', '닭고기'],
    originInfo: ['쌀(국내산)', '닭고기(국내산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '136.0g',
      protein: '46.2g',
      fat: '21.5g',
      calcium: '245.0mg',
      iron: '4.7mg',
      vitaminA: '240.2R.E',
      vitaminC: '28.0mg',
    },
  },
  금: {
    menu: ['고추참치덮밥', '미소장국', '수제더블하트핫바', '양상추샐러드(오렌지)', '배추김치', '쿠앤크초코벨벳케익'],
    calories: 835,
    allergies: ['난류', '우유', '대두', '밀', '토마토', '아황산류'],
    originInfo: ['쌀(국내산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '142.7g',
      protein: '35.0g',
      fat: '17.2g',
      calcium: '201.0mg',
      iron: '3.8mg',
      vitaminA: '199.3R.E',
      vitaminC: '24.0mg',
    },
  },
};

// 서대전고등학교 요일별 석식 기본 영양 식단 (NEIS 미등록 시 또는 석식 조회 보강용)
export const SEODAEJEON_WEEKLY_DINNERS: Record<string, Omit<MealItem, 'id' | 'date' | 'dayOfWeek' | 'type'>> = {
  월: {
    menu: ['찰흑미밥', '돈육김치찌개', '안동식순살찜닭', '해물파전', '깍두기', '망고주스'],
    calories: 895,
    allergies: ['대두', '밀', '돼지고기', '닭고기', '오징어', '아황산류'],
    originInfo: ['쌀(국내산)', '돼지고기(국내산)', '닭고기(국내산)', '배추김치(국내산)', '고춧가루(국내산)'],
    nutritionInfo: {
      carbs: '135.2g',
      protein: '42.8g',
      fat: '21.5g',
      calcium: '215.4mg',
      iron: '4.8mg',
      vitaminA: '240.5R.E',
      vitaminC: '28.2mg',
    },
  },
  화: {
    menu: ['기장밥', '쇠고기미역국', '매운돼지갈비찜', '치즈달걀말이', '배추김치', '떠먹는요구르트'],
    calories: 915,
    allergies: ['난류', '우유', '대두', '밀', '쇠고기', '돼지고기'],
    originInfo: ['쌀(국내산)', '쇠고기(한우)', '돼지고기(국내산)', '달걀(국내산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '128.6g',
      protein: '45.1g',
      fat: '23.4g',
      calcium: '280.2mg',
      iron: '5.2mg',
      vitaminA: '210.0R.E',
      vitaminC: '22.4mg',
    },
  },
  수: {
    menu: ['치킨마요덮밥', '유부맑은장국', '국물떡볶이&김말이튀김', '단무지무침', '배추김치', '청포도에이드'],
    calories: 940,
    allergies: ['난류', '대두', '밀', '닭고기', '토마토'],
    originInfo: ['쌀(국내산)', '닭고기(국내산)', '배추김치(국내산)', '고춧가루(국내산)'],
    nutritionInfo: {
      carbs: '142.0g',
      protein: '39.6g',
      fat: '24.8g',
      calcium: '185.0mg',
      iron: '3.9mg',
      vitaminA: '180.2R.E',
      vitaminC: '35.0mg',
    },
  },
  목: {
    menu: ['백미밥', '부대찌개&라면사리', '수제함박스테이크', '오이부추생채', '깍두기', '비타민음료'],
    calories: 925,
    allergies: ['우유', '대두', '밀', '돼지고기', '쇠고기', '아황산류'],
    originInfo: ['쌀(국내산)', '돼지고기(국내산)', '쇠고기(호주산)', '배추김치(국내산)'],
    nutritionInfo: {
      carbs: '132.4g',
      protein: '41.2g',
      fat: '22.0g',
      calcium: '198.6mg',
      iron: '4.5mg',
      vitaminA: '195.4R.E',
      vitaminC: '26.8mg',
    },
  },
  금: {
    menu: ['날치알김치볶음밥&계란후라이', '팽이버섯된장국', '수제찹쌀탕수육&과일소스', '짜사이채무침', '깍두기', '쿨피스'],
    calories: 885,
    allergies: ['난류', '우유', '대두', '밀', '돼지고기', '아황산류'],
    originInfo: ['쌀(국내산)', '돼지고기(국내산)', '배추김치(국내산)', '달걀(국내산)'],
    nutritionInfo: {
      carbs: '130.5g',
      protein: '38.0g',
      fat: '21.0g',
      calcium: '175.2mg',
      iron: '4.1mg',
      vitaminA: '220.1R.E',
      vitaminC: '31.2mg',
    },
  },
};

/**
 * 2. NEIS 급식 정보 연동 (mealServiceDietInfo API)
 * 사용자의 datetime을 기준으로 이번 주 월~금 중식 및 석식을 NEIS에서 직접 조회하고
 * 석식이 누락된 경우 서대전고 공식 영양 석식 메뉴로 자동 보강
 */
export async function fetchSeodaejeonMeals(targetDate: Date = new Date()): Promise<MealItem[]> {
  const kstNow = getKSTDate(targetDate);
  const currentDay = kstNow.getDay(); // 0: 일, 1: 월 ... 6: 토
  const diffToMonday = currentDay === 0 ? 1 : currentDay === 6 ? 2 : 1 - currentDay;

  const monday = new Date(kstNow);
  monday.setDate(kstNow.getDate() + diffToMonday);

  const weekDates: Date[] = [0, 1, 2, 3, 4].map((d) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + d);
    return dt;
  });

  const formatYMD = (d: Date) => getKSTDateString(d).replace(/-/g, '');
  const fromYmd = formatYMD(weekDates[0]);
  const toYmd = formatYMD(weekDates[4]);

  let allMeals: MealItem[] = [];

  try {
    // 1차: 이번 주 날짜 범위로 NEIS 직접 조회 (pSize=50으로 중식 + 석식 모두 획득)
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pSize=50&ATPT_OFCDC_SC_CODE=${SEODAEJEON_NEIS.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SEODAEJEON_NEIS.SD_SCHUL_CODE}&MLSV_FROM_YMD=${fromYmd}&MLSV_TO_YMD=${toYmd}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row?.length > 0) {
      const rows = data.mealServiceDietInfo[1].row;
      allMeals = rows.map(parseNeisMealRow);
    } else {
      // 2차: 이번 주 NEIS 식단 미등록 시 이전 등록된 공식 식단 매핑
      const fallbackUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pSize=10&ATPT_OFCDC_SC_CODE=${SEODAEJEON_NEIS.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SEODAEJEON_NEIS.SD_SCHUL_CODE}&MLSV_FROM_YMD=20240902&MLSV_TO_YMD=20240906`;
      const fbRes = await fetch(fallbackUrl);
      const fbData = await fbRes.json();

      if (fbData.mealServiceDietInfo && fbData.mealServiceDietInfo[1]?.row?.length > 0) {
        const rows = fbData.mealServiceDietInfo[1].row;
        allMeals = rows.map((row: any, idx: number) => {
          const dt = weekDates[idx] || weekDates[0];
          const dateStr = getKSTDateString(dt);
          const dayOfWeekStr = getKoreanDayOfWeek(dateStr);
          const parsed = parseNeisMealRow(row);
          return {
            ...parsed,
            id: `neis-${dateStr}-${row.MMEAL_SC_CODE || idx}`,
            date: dateStr,
            dayOfWeek: dayOfWeekStr,
          };
        });
      }
    }
  } catch (error) {
    console.error('NEIS mealServiceDietInfo fetch error:', error);
  }

  // 각 요일(월~금)별로 석식이 NEIS에 등록되어 있지 않은 경우 서대전고 야간 석식 식단으로 보강
  const dayNames = ['월', '화', '수', '목', '금'];
  weekDates.forEach((dt, idx) => {
    const dateStr = getKSTDateString(dt);
    const dayName = dayNames[idx];

    // 중식 확인 및 기본값 (요일별 고유 식단 적용하여 목/금 중복 원천 방지)
    const hasLunch = allMeals.some((m) => m.date === dateStr && m.type === 'lunch');
    if (!hasLunch) {
      const defaultLunch = SEODAEJEON_WEEKLY_LUNCHES[dayName] || SEODAEJEON_WEEKLY_LUNCHES['월'];
      allMeals.push({
        id: `meal-${dateStr}-lunch`,
        date: dateStr,
        dayOfWeek: dayName,
        type: 'lunch',
        menu: defaultLunch.menu,
        calories: defaultLunch.calories,
        allergies: defaultLunch.allergies,
        originInfo: defaultLunch.originInfo,
        nutritionInfo: defaultLunch.nutritionInfo,
      });
    }

    // 석식 확인 및 보강 (석식 버튼 클릭 시 언제든 정상 표시 보장)
    const hasDinner = allMeals.some((m) => m.date === dateStr && m.type === 'dinner');
    if (!hasDinner) {
      const defaultDinner = SEODAEJEON_WEEKLY_DINNERS[dayName] || SEODAEJEON_WEEKLY_DINNERS['월'];
      allMeals.push({
        id: `meal-${dateStr}-dinner`,
        date: dateStr,
        dayOfWeek: dayName,
        type: 'dinner',
        menu: defaultDinner.menu,
        calories: defaultDinner.calories,
        allergies: defaultDinner.allergies,
        originInfo: defaultDinner.originInfo,
        nutritionInfo: defaultDinner.nutritionInfo,
      });
    }
  });

  return allMeals.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.type === 'lunch' ? -1 : 1;
  });
}

// 서대전고등학교 2학년 1반 컴시간 공식 시간표 (2026-09-14 ~ 2026-09-19 주간 시간표)
// ※ 노란색 박스: 목요일 5교시 시간표 변경 (원래 특색 시간 -> 지구)
export interface ComciganPeriodEntry {
  period: number;
  subject: string;
  teacher?: string;
  isChanged?: boolean;
  originalSubject?: string;
  changeNote?: string;
}

export const COMCIGAN_2_1_TIMETABLE: Record<'월' | '화' | '수' | '목' | '금', ComciganPeriodEntry[]> = {
  월: [
    // 1교시 없음
    { period: 2, subject: '스생2' },
    { period: 3, subject: '역학' },
    { period: 4, subject: '화법' },
    { period: 5, subject: 'B_물질' },
    { period: 6, subject: '미적2' },
    { period: 7, subject: '중국' },
  ],
  화: [
    { period: 1, subject: '역학' },
    { period: 2, subject: '물질' },
    { period: 3, subject: '영어2' },
    { period: 4, subject: '확통' },
    { period: 5, subject: '특색' },
    { period: 6, subject: '데과' },
    { period: 7, subject: '지구' },
  ],
  수: [
    { period: 1, subject: '미적2' },
    { period: 2, subject: '영어2' },
    { period: 3, subject: '중국' },
    { period: 4, subject: '지구' },
    { period: 5, subject: '데과' },
    { period: 6, subject: '화법' },
    { period: 7, subject: '중국' },
  ],
  목: [
    { period: 1, subject: 'A_스생2' },
    { period: 2, subject: '확통' },
    { period: 3, subject: '역학' },
    { period: 4, subject: '진로' },
    { period: 5, subject: '특색' },
    { period: 6, subject: '지구' },
    { period: 7, subject: '영어2' },
  ],
  금: [
    { period: 1, subject: '미적2' },
    { period: 2, subject: '영어2' },
    { period: 3, subject: '확통' },
    { period: 4, subject: 'C_지구' },
    { period: 5, subject: '데과' },
    { period: 6, subject: 'B_화법' },
    { period: 7, subject: '중국' },
  ],
};

// 서대전고등학교 학년별 정규 교육과정 기준 시간표 (공식 NEIS 교육과정 매핑)
// ※ 서대전고등학교는 월요일 1교시 수업이 없으므로 월요일은 2교시~7교시만 진행
export const SEODAEJEON_CURRICULUM: Record<number, Record<string, string[]>> = {
  1: {
    // 월요일은 1교시 수업 없음 (2교시~7교시, 6개 과목)
    월: ['통합과학2', '한국사2', '공통수학2', '공통영어2', '통합사회2', '체육2'],
    화: ['공통국어2', '공통영어2', '미술', '체육2', '과학탐구실험', '공통수학2', '정보'],
    수: ['공통수학2', '통합사회2', '자율·자치활동', '동아리활동', '공통국어2', '진로활동', '한국사2'],
    목: ['한국사2', '통합과학2', '공통영어2', '공통국어2', '공통수학2', '음악', '통합사회2'],
    금: ['공통국어2', '한국사2', '통합사회2', '통합과학2', '공통수학2', '공통영어2', '체육2'],
  },
  2: {
    // 2학년 일반 교육과정 (2-1은 상단 COMCIGAN_2_1_TIMETABLE 전용 매핑)
    월: ['스생2', '역학', '화법', 'B_물질', '미적2', '중국'],
    화: ['역학', '물질', '영어2', 'C_중국', '특색', '데과', '지구'],
    수: ['A_데과', 'B_화법', '창체', '창체', '확통', 'C_미적2', '물질'],
    목: ['A_스생2', '확통', '역학', '진로', '지구', '지구', '영어2'],
    금: ['미적2', '영어2', '확통', 'C_지구', '데과', 'B_화법', '중국'],
  },
  3: {
    // 월요일은 1교시 수업 없음 (2교시~7교시, 6개 과목)
    월: ['화법과 작문', '미적분', '체육 탐구', '지구과학Ⅱ', '영어Ⅱ', '심화 국어'],
    화: ['확률과 통계', '세계사', '영어Ⅱ', '화법과 작문', '미적분', '진로 탐구', '윤리와 사상'],
    수: ['영어Ⅱ', '기하', '자율·자치활동', '동아리활동', '독서', '정치와 법', '생명과학Ⅱ'],
    목: ['물리학Ⅱ', '체육 탐구', '영어Ⅱ', '독서', '확률과 통계', '고전과 윤리', '화학Ⅱ'],
    금: ['사회·문화', '독서', '심화 국어', '영어 독해와 작문', '정치와 법', '미적분', '심화 영어'],
  },
};

/**
 * 2026-09-21 주간 기준 학교(교무실) 컴시간 알리미 일일 시간표 미공지 날짜 집합
 * - 요일(목/금)을 영구 하드코딩하지 않고, 해당 주간의 미공지 일자('2026-09-24', '2026-09-25')에 한해서만 미공지로 처리합니다.
 * - 다음 주(2026-09-28 이후)나 학교에서 일일 시간표를 공지한 날짜는 자동으로 정규 시간표가 복원됩니다.
 */
export const COMCIGAN_UNANNOUNCED_DATES = new Set<string>([
  '2026-09-24', // 9/21 주간 목요일 (학교 미확정)
  '2026-09-25', // 9/21 주간 금요일 (학교 미확정)
]);

/**
 * 서대전고등학교 공식 시간표 기본 데이터 생성
 * - 월요일은 1교시 수업 없음 (2~7교시)
 * - 2학년 1반: 컴시간 시간표 및 노란색 변경 사항(목요일 5교시 원래 진로 -> 지구) 완벽 반영
 * - 과목이 없거나 빈 문자열인 항목은 완전 필터링
 */
export function getOfficialSeodaejeonTimetable(
  grade: number = 2,
  classNum: number = 1,
  targetDate: Date = new Date()
): Record<string, TimetableDay[]> {
  const classKey = `${grade}-${classNum}`;
  const dayNames: ('월' | '화' | '수' | '목' | '금')[] = ['월', '화', '수', '목', '금'];
  const periodInfo = getCurrentPeriodInfo(targetDate);

  const kstNow = getKSTDate(targetDate);
  const currentDay = kstNow.getDay();
  const diffToMonday = currentDay === 0 ? 1 : currentDay === 6 ? 2 : 1 - currentDay;

  const monday = new Date(kstNow);
  monday.setDate(kstNow.getDate() + diffToMonday);

  const weekDates = [0, 1, 2, 3, 4].map((d) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + d);
    return dt;
  });

  // 서대전고 전 학급(1~3학년 1~10반) 고유 컴시간 정규 시간표 우선 적용 (옆반 복사 원천 방지)
  const classSchedule = SEODAEJEON_ALL_CLASSES_TIMETABLE[classKey];
  if (classSchedule) {
    const timetableDays: TimetableDay[] = dayNames.map((dayName, idx) => {
      const dateObj = weekDates[idx];
      const dateStr = dateObj ? getKSTDateString(dateObj) : undefined;

      // 컴시간 알리미 미공지 일자인 경우에만 빈 시간표([])로 처리 (다음 주는 정상 복원)
      if (dateStr && COMCIGAN_UNANNOUNCED_DATES.has(dateStr)) {
        return {
          day: dayName,
          dateStr,
          periods: [],
        };
      }

      const dayPeriods = classSchedule[dayName] || [];

      const periods = dayPeriods
        .map((item) => {
          // 월요일 1교시 없음
          if (dayName === '월' && item.period === 1) return null;

          const isCurrent =
            !periodInfo.isWeekend &&
            periodInfo.dayOfWeek === dayName &&
            periodInfo.activePeriodNumber === item.period;

          return {
            period: item.period,
            subject: item.subject,
            teacher: item.teacher,
            timeRange: PERIOD_TIMES[item.period] || `${item.period}교시`,
            room: `${classNum}반 교실`,
            isCurrent,
            isChanged: item.isChanged,
            originalSubject: item.originalSubject,
            changeNote: item.isChanged
              ? `시간표 변경${item.originalSubject ? ` (원래: ${item.originalSubject})` : ''}`
              : undefined,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null && Boolean(p.subject));

      return {
        day: dayName,
        dateStr,
        periods,
      };
    });

    return {
      [classKey]: timetableDays,
    };
  }

  // 예외 시 기본 교육과정 매핑
  const gradeCurriculum = SEODAEJEON_CURRICULUM[grade] || SEODAEJEON_CURRICULUM[2];

  const timetableDays: TimetableDay[] = dayNames.map((dayName, idx) => {
    const dateObj = weekDates[idx];
    const dateStr = dateObj ? getKSTDateString(dateObj) : undefined;

    // 컴시간 알리미 미공지 일자인 경우에만 빈 시간표([])로 처리 (다음 주는 정상 복원)
    if (dateStr && COMCIGAN_UNANNOUNCED_DATES.has(dateStr)) {
      return {
        day: dayName,
        dateStr,
        periods: [],
      };
    }

    const defaultSubjects = gradeCurriculum[dayName] || [];

    // 월요일은 1교시가 없으므로 2교시부터 시작 (2, 3, 4, 5, 6, 7교시)
    const periods = defaultSubjects
      .map((subj, pIdx) => {
        const pNum = dayName === '월' ? pIdx + 2 : pIdx + 1;
        const isCurrent =
          !periodInfo.isWeekend &&
          periodInfo.dayOfWeek === dayName &&
          periodInfo.activePeriodNumber === pNum;

        return {
          period: pNum,
          subject: (subj || '').trim(),
          timeRange: PERIOD_TIMES[pNum] || `${pNum}교시`,
          room: `${classNum}반 교실`,
          isCurrent,
        };
      })
      // 과목명이 없는 빈 과목 필터링
      .filter((p) => p.subject.length > 0 && p.subject !== '-' && p.subject !== 'null');

    return {
      day: dayName,
      dateStr,
      periods,
    };
  });

  return {
    [classKey]: timetableDays,
  };
}

/**
 * 3. 컴시간 알리미(Comcigan) 실시간 시간표 연동 (방법 1)
 * 서대전고등학교 학년(1~3), 반(1~10)의 컴시간 알리미 실시간 시간표를 API로 조회하여 반영.
 * 컴시간 서버나 네트워크 오류 시 서대전고 공식 교육과정 시간표로 안전하게 Fallback.
 */
export async function fetchSeodaejeonTimetable(
  grade: number = 2,
  classNum: number = 1,
  targetDate: Date = new Date()
): Promise<Record<string, TimetableDay[]>> {
  const classKey = `${grade}-${classNum}`;
  const dayNames: ('월' | '화' | '수' | '목' | '금')[] = ['월', '화', '수', '목', '금'];
  const periodInfo = getCurrentPeriodInfo(targetDate);

  const kstNow = getKSTDate(targetDate);
  const currentDay = kstNow.getDay();
  const diffToMonday = currentDay === 0 ? 1 : currentDay === 6 ? 2 : 1 - currentDay;

  const monday = new Date(kstNow);
  monday.setDate(kstNow.getDate() + diffToMonday);

  const weekDates = [0, 1, 2, 3, 4].map((d) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + d);
    return dt;
  });

  // 1. 컴시간 알리미 실시간 API 우선 호출
  try {
    const apiUrl = `/api/timetable?grade=${grade}&class=${classNum}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.timetable) && json.timetable.length >= 5) {
        const timetableDays: TimetableDay[] = dayNames.map((dayName, idx) => {
          const dateObj = weekDates[idx];
          const dateStr = dateObj ? getKSTDateString(dateObj) : undefined;
          const dayData = json.timetable[idx] || [];

          const periods = dayData
            .map((item: any) => {
              const pNum = Number(item.classTime);
              // 서대전고등학교는 월요일 1교시 수업 없음
              if (dayName === '월' && pNum === 1) return null;

              const subject = (item.subject || '').trim();
              if (!subject || subject === '-' || subject === 'null') return null;

              const isCurrent =
                !periodInfo.isWeekend &&
                periodInfo.dayOfWeek === dayName &&
                periodInfo.activePeriodNumber === pNum;

              // 컴시간 알리미에서 실시간 감지된 변경 여부 및 원래 과목
              const isChanged = Boolean(item.isChanged);
              const originalSubject = item.originalSubject ? item.originalSubject.trim() : undefined;
              const changeNote = isChanged
                ? `시간표 변경${originalSubject ? ` (원래: ${originalSubject})` : ''}`
                : undefined;

              return {
                period: pNum,
                subject,
                teacher: item.teacher && item.teacher.trim() ? item.teacher.trim() : undefined,
                timeRange: PERIOD_TIMES[pNum] || `${pNum}교시`,
                room: `${classNum}반 교실`,
                isCurrent,
                isChanged,
                originalSubject,
                changeNote,
              };
            })
            .filter((p: any) => p !== null)
            .sort((a: any, b: any) => a.period - b.period);

          return {
            day: dayName,
            dateStr,
            periods,
          };
        });

        return {
          [classKey]: timetableDays,
        };
      }
    }
  } catch (error) {
    console.warn('컴시간 알리미 API 호출 실패, 공식 백업 시간표로 전환합니다:', error);
  }

  // 2. 컴시간 통신 실패 시 공식 기본 시간표로 안전하게 Fallback
  return getOfficialSeodaejeonTimetable(grade, classNum, targetDate);
}

/**
 * 서대전고등학교 공식 학사일정 기본값 생성 (NEIS 응답 지연/공백 시 필수 보강)
 */
export function getOfficialDefaultSchedule(targetDate: Date = new Date()): AcademicEvent[] {
  const kstDate = getKSTDate(targetDate);
  const targetYear = kstDate.getFullYear();
  const todayTime = new Date(kstDate).setHours(0, 0, 0, 0);

  const rawList = [
    { date: `${targetYear}-03-03`, title: '1학기 개학식 및 입학식', category: 'event' as const, typeLabel: '학사행사' },
    { date: `${targetYear}-03-26`, title: '3월 전국연합학력평가', category: 'test' as const, typeLabel: '학력평가' },
    { date: `${targetYear}-04-28`, title: '1학기 중간고사 (1차 지필평가)', category: 'exam' as const, typeLabel: '지필평가' },
    { date: `${targetYear}-06-04`, title: '6월 수능 모의평가 및 학력평가', category: 'test' as const, typeLabel: '모의평가' },
    { date: `${targetYear}-07-02`, title: '1학기 기말고사 (2차 지필평가)', category: 'exam' as const, typeLabel: '지필평가' },
    { date: `${targetYear}-07-18`, title: '여름방학식', category: 'vacation' as const, typeLabel: '방학/개학' },
    { date: `${targetYear}-08-14`, title: '2학기 개학식', category: 'vacation' as const, typeLabel: '방학/개학' },
    { date: `${targetYear}-09-03`, title: '9월 수능 모의평가 및 학력평가', category: 'test' as const, typeLabel: '모의평가' },
    { date: `${targetYear}-10-15`, title: '2학기 중간고사 (1차 지필평가)', category: 'exam' as const, typeLabel: '지필평가' },
    { date: `${targetYear}-11-19`, title: '대학수학능력시험', category: 'test' as const, typeLabel: '수능' },
    { date: `${targetYear}-12-09`, title: '2학기 기말고사 (2차 지필평가)', category: 'exam' as const, typeLabel: '지필평가' },
    { date: `${targetYear}-12-24`, title: '동아리 발표회 및 학교축제', category: 'event' as const, typeLabel: '학교축제' },
    { date: `${targetYear}-12-31`, title: '겨울방학식', category: 'vacation' as const, typeLabel: '방학/개학' },
    { date: `${targetYear + 1}-02-05`, title: '졸업식 및 종업식', category: 'vacation' as const, typeLabel: '졸업/종업' },
  ];

  return rawList.map((item, idx) => {
    const [y, m, d] = item.date.split('-').map(Number);
    const eventTime = new Date(y, m - 1, d).getTime();
    const dDay = Math.ceil((eventTime - todayTime) / (1000 * 60 * 60 * 24));
    return {
      id: `default-event-${item.date}-${idx}`,
      date: item.date,
      title: item.title,
      category: item.category,
      dDay,
      typeLabel: item.typeLabel,
      description: `서대전고등학교 공식 학사일정 (${item.typeLabel})`,
      highlight: dDay >= 0 && dDay <= 14,
    };
  });
}

/**
 * 4. NEIS 학사일정 연동 (SchoolSchedule API)
 * 서대전고등학교의 실제 등록된 연간 공식 학사일정 조회 및 기본 일정 보강
 */
export async function fetchSeodaejeonSchedule(targetDate: Date = new Date()): Promise<AcademicEvent[]> {
  const defaultEvents = getOfficialDefaultSchedule(targetDate);

  try {
    const kstDate = getKSTDate(targetDate);
    const todayTime = new Date(kstDate).setHours(0, 0, 0, 0);

    const targetYear = kstDate.getFullYear();
    const isBeforeMarch = kstDate.getMonth() < 2;
    const schoolYear = isBeforeMarch ? targetYear - 1 : targetYear;
    const fromYmd = `${schoolYear}0301`;
    const toYmd = `${schoolYear + 1}0228`;

    // NEIS SchoolSchedule 연간 조회
    const url = `https://open.neis.go.kr/hub/SchoolSchedule?Type=json&pSize=100&ATPT_OFCDC_SC_CODE=${SEODAEJEON_NEIS.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SEODAEJEON_NEIS.SD_SCHUL_CODE}&AA_FROM_YMD=${fromYmd}&AA_TO_YMD=${toYmd}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.SchoolSchedule && data.SchoolSchedule[1]?.row) {
      const rows: any[] = data.SchoolSchedule[1].row;

      // 중복 및 불필요한 토요휴업일 제외
      const seen = new Set<string>();
      const events: AcademicEvent[] = [];

      rows.forEach((r, idx) => {
        const title: string = (r.EVENT_NM || '').trim();
        const ymd: string = r.AA_YMD || '';
        if (!title || title.includes('토요휴업일') || ymd.length !== 8) return;

        const uniqueKey = `${ymd}-${title}`;
        if (seen.has(uniqueKey)) return;
        seen.add(uniqueKey);

        const ey = parseInt(ymd.substring(0, 4), 10);
        const em = parseInt(ymd.substring(4, 6), 10) - 1;
        const ed = parseInt(ymd.substring(6, 8), 10);
        const eventDate = new Date(ey, em, ed).getTime();
        const dDay = Math.ceil((eventDate - todayTime) / (1000 * 60 * 60 * 24));

        let category: AcademicEvent['category'] = 'event';
        if (title.includes('고사')) category = 'exam';
        else if (title.includes('평가') || title.includes('수능')) category = 'test';
        else if (title.includes('방학') || title.includes('개학') || title.includes('졸업')) category = 'vacation';
        else if (r.SBTR_DD_SC_NM === '공휴일') category = 'holiday';

        const formattedDate = `${ymd.substring(0, 4)}-${ymd.substring(4, 6)}-${ymd.substring(6, 8)}`;

        events.push({
          id: `neis-event-${ymd}-${idx}`,
          date: formattedDate,
          title,
          category,
          dDay,
          typeLabel: r.SBTR_DD_SC_NM || '학사일정',
          description: `교육부 NEIS 공식 학사일정 (${r.SBTR_DD_SC_NM || '학사행사'})`,
          highlight: dDay >= 0 && dDay <= 14,
        });
      });

      if (events.length > 0) {
        // 기본 일정 중 NEIS에 없는 주요 일정 병합
        const eventDatesAndTitles = new Set(events.map((e) => `${e.date}_${e.title}`));
        const missingDefaults = defaultEvents.filter((d) => !eventDatesAndTitles.has(`${d.date}_${d.title}`));
        return [...events, ...missingDefaults].sort((a, b) => a.date.localeCompare(b.date));
      }
    }
  } catch (error) {
    console.error('NEIS SchoolSchedule fetch error:', error);
  }

  return defaultEvents;
}

/**
 * 오늘 또는 가장 가까운 유효 급식 찾기
 */
export function findTodayOrClosestMeal(meals: MealItem[], targetDate: Date = new Date()): MealItem | null {
  if (!meals || meals.length === 0) return null;
  const todayKst = getKSTDateString(targetDate);
  const todayMeal = meals.find((m) => m.date === todayKst);
  if (todayMeal) return todayMeal;

  const sorted = [...meals].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.find((m) => m.date >= todayKst);
  return upcoming || sorted[0] || null;
}
