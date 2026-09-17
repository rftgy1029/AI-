/**
 * 서대전고등학교 실시간 날짜·시각(Datetime) 및 교시/급식 상태 관리 유틸리티
 */

export interface PeriodScheduleItem {
  period: number | 'lunch' | 'morning' | 'break' | 'cleaning' | 'afterschool' | 'night' | 'dismissal';
  name: string;
  startMinutes: number; // 00:00 기준 분
  endMinutes: number;   // 00:00 기준 분
  timeRangeStr: string;
  isBreak?: boolean;
}

// 서대전고 표준 일과 시간표 (월, 화, 목, 금: 7교시 / 수: 6교시 및 동아리)
export const SEODAEJEON_BELL_SCHEDULE: PeriodScheduleItem[] = [
  { period: 'morning', name: '등교 및 아침 자습', startMinutes: 8 * 60 + 30, endMinutes: 9 * 60, timeRangeStr: '08:30 - 09:00' },
  { period: 1, name: '1교시', startMinutes: 9 * 60, endMinutes: 9 * 60 + 50, timeRangeStr: '09:00 - 09:50' },
  { period: 'break', name: '쉬는 시간', startMinutes: 9 * 60 + 50, endMinutes: 10 * 60, timeRangeStr: '09:50 - 10:00', isBreak: true },
  { period: 2, name: '2교시', startMinutes: 10 * 60, endMinutes: 10 * 60 + 50, timeRangeStr: '10:00 - 10:50' },
  { period: 'break', name: '쉬는 시간', startMinutes: 10 * 60 + 50, endMinutes: 11 * 60, timeRangeStr: '10:50 - 11:00', isBreak: true },
  { period: 3, name: '3교시', startMinutes: 11 * 60, endMinutes: 11 * 60 + 50, timeRangeStr: '11:00 - 11:50' },
  { period: 'break', name: '쉬는 시간', startMinutes: 11 * 60 + 50, endMinutes: 12 * 60, timeRangeStr: '11:50 - 12:00', isBreak: true },
  { period: 4, name: '4교시', startMinutes: 12 * 60, endMinutes: 12 * 60 + 50, timeRangeStr: '12:00 - 12:50' },
  { period: 'lunch', name: '점심시간 & 방송', startMinutes: 12 * 60 + 50, endMinutes: 13 * 60 + 50, timeRangeStr: '12:50 - 13:50' },
  { period: 5, name: '5교시', startMinutes: 13 * 60 + 50, endMinutes: 14 * 60 + 40, timeRangeStr: '13:50 - 14:40' },
  { period: 'break', name: '쉬는 시간', startMinutes: 14 * 60 + 40, endMinutes: 14 * 60 + 50, timeRangeStr: '14:40 - 14:50', isBreak: true },
  { period: 6, name: '6교시', startMinutes: 14 * 60 + 50, endMinutes: 15 * 60 + 40, timeRangeStr: '14:50 - 15:40' },
  { period: 'break', name: '쉬는 시간', startMinutes: 15 * 60 + 40, endMinutes: 15 * 60 + 50, timeRangeStr: '15:40 - 15:50', isBreak: true },
  { period: 7, name: '7교시', startMinutes: 15 * 60 + 50, endMinutes: 16 * 60 + 40, timeRangeStr: '15:50 - 16:40' },
  { period: 'cleaning', name: '종례 및 청소', startMinutes: 16 * 60 + 40, endMinutes: 17 * 60, timeRangeStr: '16:40 - 17:00' },
  { period: 'afterschool', name: '방과후 수업', startMinutes: 17 * 60, endMinutes: 18 * 60, timeRangeStr: '17:00 - 18:00' },
  { period: 'night', name: '야간 자율학습', startMinutes: 19 * 60, endMinutes: 21 * 60, timeRangeStr: '19:00 - 21:00' },
];

export interface CurrentPeriodInfo {
  activePeriodNumber: number | null; // 1~7 or null
  isLunchTime: boolean;
  isBreakTime: boolean;
  isSchoolHours: boolean;
  isWeekend: boolean;
  label: string;
  subLabel: string;
  timeRange: string;
  remainingMinutes: number;
  remainingSeconds: number;
  progressPercent: number;
  nextPeriodName: string | null;
  dayOfWeek: '일' | '월' | '화' | '수' | '목' | '금' | '토';
  dateFormatted: string; // YYYY.MM.DD
  timeFormatted: string; // HH:MM:SS
}

export interface MealStatusInfo {
  isLunchActive: boolean; // 12:50 ~ 13:50
  statusLabel: string;
  subLabel: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'indigo' | 'slate';
  recommendedMealType: 'lunch' | 'dinner';
  countdownMinutes: number | null;
  targetMealDate: string; // YYYY-MM-DD
}

/**
 * 한국 표준시(KST) Date 객체
 */
export function getKSTDate(dateInput: Date = new Date()): Date {
  const kstString = dateInput.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
  return new Date(kstString);
}

/**
 * 한국 표준시(KST) 기준 날짜 문자열 반환 (YYYY-MM-DD)
 */
export function getKSTDateString(dateInput: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dateInput);
}

/**
 * 한국 표준시(KST) 기준 요일 (일, 월, 화, 수, 목, 금, 토)
 */
export function getKSTDayOfWeek(dateInput: Date = new Date()): '일' | '월' | '화' | '수' | '목' | '금' | '토' {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  });
  return formatter.format(dateInput) as any;
}

/**
 * 사용자 현재 시각 기준 교시 및 일과 상세 정보 계산
 */
export function getCurrentPeriodInfo(dateInput: Date = new Date()): CurrentPeriodInfo {
  const now = getKSTDate(dateInput);
  const dayOfWeek = getKSTDayOfWeek(now);
  const isWeekend = dayOfWeek === '토' || dayOfWeek === '일';

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const totalMinutes = hours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const dateFormatted = `${y}.${m}.${d}`;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (isWeekend) {
    return {
      activePeriodNumber: null,
      isLunchTime: false,
      isBreakTime: false,
      isSchoolHours: false,
      isWeekend: true,
      label: '주말 자율 학습',
      subLabel: '다음 주 수업 및 식단을 확인해보세요',
      timeRange: '주말 휴일',
      remainingMinutes: 0,
      remainingSeconds: 0,
      progressPercent: 0,
      nextPeriodName: '월요일 1교시',
      dayOfWeek,
      dateFormatted,
      timeFormatted,
    };
  }

  // Find matching schedule item
  for (let i = 0; i < SEODAEJEON_BELL_SCHEDULE.length; i++) {
    const item = SEODAEJEON_BELL_SCHEDULE[i];
    if (totalMinutes >= item.startMinutes && totalMinutes < item.endMinutes) {
      const durationSeconds = (item.endMinutes - item.startMinutes) * 60;
      const elapsedSeconds = totalSeconds - item.startMinutes * 60;
      const remainingSec = Math.max(0, item.endMinutes * 60 - totalSeconds);
      const remainingMin = Math.ceil(remainingSec / 60);
      const progress = Math.min(100, Math.max(0, Math.round((elapsedSeconds / durationSeconds) * 100)));

      const nextItem = SEODAEJEON_BELL_SCHEDULE[i + 1];
      const nextName = nextItem ? nextItem.name : '하교 및 귀가';

      if (typeof item.period === 'number') {
        return {
          activePeriodNumber: item.period,
          isLunchTime: false,
          isBreakTime: false,
          isSchoolHours: true,
          isWeekend: false,
          label: `${item.period}교시 진행 중`,
          subLabel: `종료까지 ${remainingMin}분 남음`,
          timeRange: item.timeRangeStr,
          remainingMinutes: remainingMin,
          remainingSeconds: remainingSec,
          progressPercent: progress,
          nextPeriodName: nextName,
          dayOfWeek,
          dateFormatted,
          timeFormatted,
        };
      }

      if (item.period === 'lunch') {
        return {
          activePeriodNumber: null,
          isLunchTime: true,
          isBreakTime: false,
          isSchoolHours: true,
          isWeekend: false,
          label: '🍱 점심시간 & 방송',
          subLabel: `식사 시간 ${remainingMin}분 남음 (5교시 준비)`,
          timeRange: item.timeRangeStr,
          remainingMinutes: remainingMin,
          remainingSeconds: remainingSec,
          progressPercent: progress,
          nextPeriodName: '5교시',
          dayOfWeek,
          dateFormatted,
          timeFormatted,
        };
      }

      if (item.isBreak) {
        return {
          activePeriodNumber: null,
          isLunchTime: false,
          isBreakTime: true,
          isSchoolHours: true,
          isWeekend: false,
          label: '쉬는 시간',
          subLabel: `다음 ${nextName}까지 ${remainingMin}분`,
          timeRange: item.timeRangeStr,
          remainingMinutes: remainingMin,
          remainingSeconds: remainingSec,
          progressPercent: progress,
          nextPeriodName: nextName,
          dayOfWeek,
          dateFormatted,
          timeFormatted,
        };
      }

      return {
        activePeriodNumber: null,
        isLunchTime: false,
        isBreakTime: false,
        isSchoolHours: true,
        isWeekend: false,
        label: item.name,
        subLabel: `${remainingMin}분 남음`,
        timeRange: item.timeRangeStr,
        remainingMinutes: remainingMin,
        remainingSeconds: remainingSec,
        progressPercent: progress,
        nextPeriodName: nextName,
        dayOfWeek,
        dateFormatted,
        timeFormatted,
      };
    }
  }

  // Before 08:30
  if (totalMinutes < 8 * 60 + 30) {
    const diffToSchool = 8 * 60 + 30 - totalMinutes;
    return {
      activePeriodNumber: null,
      isLunchTime: false,
      isBreakTime: false,
      isSchoolHours: false,
      isWeekend: false,
      label: '등교 전',
      subLabel: `08:30 등교 시간까지 ${Math.floor(diffToSchool / 60)}시간 ${diffToSchool % 60}분`,
      timeRange: '등교 전',
      remainingMinutes: diffToSchool,
      remainingSeconds: diffToSchool * 60,
      progressPercent: 0,
      nextPeriodName: '1교시 (09:00)',
      dayOfWeek,
      dateFormatted,
      timeFormatted,
    };
  }

  // After school hours (post 21:00)
  return {
    activePeriodNumber: null,
    isLunchTime: false,
    isBreakTime: false,
    isSchoolHours: false,
    isWeekend: false,
    label: '하교 완료 및 자율학습',
    subLabel: '내일의 시간표와 급식을 미리 확인하세요',
    timeRange: '일과 종료',
    remainingMinutes: 0,
    remainingSeconds: 0,
    progressPercent: 100,
    nextPeriodName: '내일 1교시',
    dayOfWeek,
    dateFormatted,
    timeFormatted,
  };
}

/**
 * 실시간 급식 상태 (점심 배식 전/중/후, 석식 등)
 */
export function getMealStatusInfo(dateInput: Date = new Date()): MealStatusInfo {
  const now = getKSTDate(dateInput);
  const dayOfWeek = getKSTDayOfWeek(now);
  const isWeekend = dayOfWeek === '토' || dayOfWeek === '일';
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const todayStr = getKSTDateString(now);

  if (isWeekend) {
    return {
      isLunchActive: false,
      statusLabel: '주말 휴일 식단',
      subLabel: '다가오는 월요일 식단을 미리 확인하세요',
      badgeColor: 'slate',
      recommendedMealType: 'lunch',
      countdownMinutes: null,
      targetMealDate: todayStr,
    };
  }

  // 12:50 ~ 13:50: 점심시간 활성
  if (totalMinutes >= 12 * 60 + 50 && totalMinutes < 13 * 60 + 50) {
    const remaining = 13 * 60 + 50 - totalMinutes;
    return {
      isLunchActive: true,
      statusLabel: '맛있는 점심 배식 중 🍱',
      subLabel: `배식 마감까지 ${remaining}분 남았습니다`,
      badgeColor: 'emerald',
      recommendedMealType: 'lunch',
      countdownMinutes: remaining,
      targetMealDate: todayStr,
    };
  }

  // 오전: 점심 전 (00:00 ~ 12:50)
  if (totalMinutes < 12 * 60 + 50) {
    const diff = 12 * 60 + 50 - totalMinutes;
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    const timeText = diffH > 0 ? `${diffH}시간 ${diffM}분 후` : `${diffM}분 후`;
    return {
      isLunchActive: false,
      statusLabel: `점심시간까지 ${timeText} (12:50)`,
      subLabel: '오늘의 메뉴를 미리 확인해보세요',
      badgeColor: 'amber',
      recommendedMealType: 'lunch',
      countdownMinutes: diff,
      targetMealDate: todayStr,
    };
  }

  // 오후: 13:50 ~ 18:00
  if (totalMinutes < 18 * 60) {
    return {
      isLunchActive: false,
      statusLabel: '오늘 점심 배식 완료',
      subLabel: '오늘 점심 식단 평가와 한줄평을 남겨보세요!',
      badgeColor: 'blue',
      recommendedMealType: 'lunch',
      countdownMinutes: null,
      targetMealDate: todayStr,
    };
  }

  // 저녁 이후 (18:00 ~ 24:00)
  return {
    isLunchActive: false,
    statusLabel: '내일의 급식 준비 중',
    subLabel: '내일 제공될 영양 가득한 메뉴를 확인하세요',
    badgeColor: 'indigo',
    recommendedMealType: 'lunch',
    countdownMinutes: null,
    targetMealDate: todayStr,
  };
}
