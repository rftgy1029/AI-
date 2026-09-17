export type Role = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  grade: number;
  classNum: number;
  studentNumber?: number;
  badge?: string;
  department?: string;
}

export interface MealItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // 월, 화, 수, 목, 금
  type: 'lunch' | 'dinner';
  menu: string[];
  calories: number;
  allergies: string[];
  nutritionInfo?: {
    carbs?: string;
    protein?: string;
    fat?: string;
    vitaminA?: string;
    thiamine?: string;
    riboflavin?: string;
    vitaminC?: string;
    calcium?: string;
    iron?: string;
  };
  originInfo?: string[];
  servingCount?: number;
}

export interface TimetablePeriod {
  period: number;
  subject: string;
  timeRange: string; // e.g. "09:00 ~ 09:50"
  room?: string;
  isCurrent?: boolean;
}

export interface TimetableDay {
  day: '월' | '화' | '수' | '목' | '금';
  dateStr?: string; // YYYY-MM-DD
  periods: TimetablePeriod[];
}

export interface AcademicEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'exam' | 'test' | 'vacation' | 'festival' | 'holiday' | 'event';
  description?: string;
  dDay: number; // days remaining (negative = past)
  typeLabel?: string; // 공휴일, 학사행사 등
  highlight?: boolean;
  isCustom?: boolean;
  createdBy?: string;
}

export interface SchoolInfo {
  name: string;
  engName?: string;
  foundDate: string;
  anniversaryDate: string;
  schoolType: string;
  foundationType: string;
  coedu: string;
  address: string;
  zipCode: string;
  tel: string;
  fax: string;
  homepage: string;
  officeOfEdu: string;
  schoolCode: string;
  motto: string;
  tree: string;
  flower: string;
}

export type SuggestionCategory = '전체' | '급식' | '시설/환경' | '학사/수업' | '학생자치/동아리' | '기타';
export type SuggestionStatus = '접수대기' | '검토중' | '답변완료';

export interface SuggestionComment {
  id: string;
  authorName: string;
  grade: number;
  classNum: number;
  content: string;
  createdAt: string;
  password?: string;
}

export interface SuggestionItem {
  id: string;
  title: string;
  content: string;
  authorName: string;
  grade: number; // 1, 2, 3 (or 0 for staff)
  classNum: number; // 1~10
  studentNumber?: number;
  category: '급식' | '시설/환경' | '학사/수업' | '학생자치/동아리' | '기타';
  status: SuggestionStatus;
  likeCount: number;
  likedByMe?: boolean;
  comments?: SuggestionComment[];
  reply?: {
    author: string;
    content: string;
    date: string;
  };
  passwordHash?: string; // 4-digit PIN for author self-action
  createdAt: string;
  viewCount?: number;
}

