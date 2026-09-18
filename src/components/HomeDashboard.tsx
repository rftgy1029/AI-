import { useState, useEffect } from 'react';
import {
  Utensils,
  CalendarDays,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ExternalLink,
  Users,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  UserProfile,
  MealItem,
  TimetableDay,
  AcademicEvent,
} from '../types';
import {
  getKSTDayOfWeek,
  getKSTDateString,
  OFFICIAL_SCHOOL_INFO,
  PERIOD_TIMES,
  getOfficialSeodaejeonTimetable,
} from '../services/neisService';
import { getCurrentPeriodInfo, getMealStatusInfo } from '../utils/datetime';

interface HomeDashboardProps {
  currentUser: UserProfile;
  activeMeal: MealItem | null;
  timetable: Record<string, TimetableDay[]>;
  events: AcademicEvent[];
  onNavigate: (tab: string) => void;
  onOpenClassChange: () => void;
}

export default function HomeDashboard({
  currentUser,
  activeMeal,
  timetable,
  events,
  onNavigate,
  onOpenClassChange,
}: HomeDashboardProps) {
  const classKey = `${currentUser.grade}-${currentUser.classNum}`;
  const classTimetable =
    timetable[classKey] && timetable[classKey].length > 0 && timetable[classKey].some((d) => d.periods.length > 0)
      ? timetable[classKey]
      : getOfficialSeodaejeonTimetable(currentUser.grade, currentUser.classNum)[classKey] || [];

  const kstDay = getKSTDayOfWeek();
  const dayIndexMap: Record<string, number> = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4 };
  const todayIdx = dayIndexMap[kstDay] ?? 0;

  const todayTimetable =
    classTimetable.find((t) => t.day === kstDay) ||
    classTimetable[todayIdx] ||
    classTimetable[0] || {
      day: kstDay,
      periods: [],
    };

  const todayDateStr = getKSTDateString();

  // Real-time Datetime Status
  const [periodInfo, setPeriodInfo] = useState(() => getCurrentPeriodInfo());
  const [mealStatus, setMealStatus] = useState(() => getMealStatusInfo());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setPeriodInfo(getCurrentPeriodInfo(now));
      setMealStatus(getMealStatusInfo(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = events.filter((e) => e.dDay >= 0).slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Real-time Status Top Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                NEIS 실시간 연동
              </span>

              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {todayDateStr} ({kstDay}요일)
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              서대전고등학교 스마트 포털
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
              <button
                type="button"
                onClick={onOpenClassChange}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5F5F7] text-slate-800 hover:bg-slate-200/80 active:scale-95 transition cursor-pointer border border-black/[0.03]"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>{currentUser.grade}학년 {currentUser.classNum}반</span>
                <span className="text-slate-400 font-normal underline ml-0.5 text-[11px]">변경</span>
              </button>

              {periodInfo.isSchoolHours && !periodInfo.isWeekend && periodInfo.activePeriodNumber ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  현재 {periodInfo.activePeriodNumber}교시 ({periodInfo.timeRemainingMinutes}분 남음)
                </span>
              ) : periodInfo.isWeekend ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-600">
                  주말 휴업일
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-600">
                  일과 외 시간
                </span>
              )}

              {mealStatus.isLunchActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/60">
                  🍱 점심 배식 진행 중
                </span>
              ) : mealStatus.isBeforeLunch ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                  🍱 점심시간까지 {mealStatus.timeUntilLunch}
                </span>
              ) : null}
            </div>
          </div>

          {/* Quick Action Buttons - Grid on mobile for easy thumb reach */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2.5 pt-1 sm:pt-0 shrink-0">
            <button
              onClick={() => onNavigate('meal')}
              className="py-3 px-4 rounded-2xl sm:rounded-full text-sm font-bold bg-black text-white hover:bg-slate-800 active:scale-95 transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              <span>급식표</span>
            </button>
            <button
              onClick={() => onNavigate('timetable')}
              className="py-3 px-4 rounded-2xl sm:rounded-full text-sm font-bold bg-[#F5F5F7] text-slate-800 hover:bg-slate-200/80 active:scale-95 transition cursor-pointer border border-black/[0.04] flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span>시간표</span>
            </button>
            <button
              onClick={() => onNavigate('board')}
              className="py-3 px-4 rounded-2xl sm:rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition cursor-pointer border border-indigo-200/60 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>게시판</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Main 2-Column Bento Grid: Meals & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bento 1: 오늘의 실제 급식 */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">오늘의 급식</h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    {activeMeal ? `${activeMeal.date} (${activeMeal.dayOfWeek}요일)` : 'NEIS 식단'}
                  </span>
                </div>
              </div>

              {activeMeal && (
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  <Flame className="w-3 h-3 text-rose-500" />
                  <span>{activeMeal.calories} kcal</span>
                </div>
              )}
            </div>

            {activeMeal && activeMeal.menu.length > 0 ? (
              <div className="mt-4 sm:mt-5 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeMeal.menu.map((dish, i) => (
                    <div
                      key={i}
                      className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#F5F5F7] text-xs font-semibold text-slate-800 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-lg bg-white border border-black/[0.06] text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{dish}</span>
                    </div>
                  ))}
                </div>

                {activeMeal.allergies.length > 0 && (
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-2 pt-2 border-t border-slate-100 truncate">
                    알레르기: {activeMeal.allergies.slice(0, 4).join(', ')}
                    {activeMeal.allergies.length > 4 ? ` 외 ${activeMeal.allergies.length - 4}종` : ''}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 sm:py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <Utensils className="w-7 h-7 mx-auto text-slate-300" />
                <p>오늘은 제공되는 급식이 없습니다 (주말 또는 휴업일).</p>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-black/[0.04]">
            <button
              onClick={() => onNavigate('meal')}
              className="w-full py-3.5 rounded-2xl bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-98 text-slate-800 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-black/[0.03]"
            >
              <span>주간 급식표 및 석식 전체보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bento 2: 오늘의 실제 시간표 */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    오늘 시간표 ({currentUser.grade}-{currentUser.classNum})
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    {todayTimetable.day}요일 정규 수업
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenClassChange}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                학급 변경
              </button>
            </div>

            {todayTimetable.periods.length > 0 ? (
              <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                {todayTimetable.periods.map((p) => {
                  const isCurrent =
                    !periodInfo.isWeekend &&
                    periodInfo.dayOfWeek === todayTimetable.day &&
                    periodInfo.activePeriodNumber === p.period;

                  return (
                    <div
                      key={p.period}
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-between text-xs sm:text-sm transition ${
                        p.isChanged
                          ? 'bg-amber-100/90 text-amber-950 font-bold border-2 border-amber-400'
                          : isCurrent
                          ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                          : 'bg-[#F5F5F7] text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            p.isChanged
                              ? 'bg-amber-400 text-amber-950'
                              : isCurrent
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-600 border border-black/[0.06]'
                          }`}
                        >
                          {p.period}
                        </span>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate font-bold">{p.subject}</span>
                          {p.teacher && (
                            <span className="text-[11px] text-slate-500 font-normal shrink-0">
                              ({p.teacher})
                            </span>
                          )}
                          {p.isChanged && (
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-300 px-1.5 py-0.5 rounded shrink-0">
                              변경 (원래: {p.originalSubject || '진로'})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs shrink-0 text-slate-400">
                        <span className="hidden xs:inline">{p.timeRange || PERIOD_TIMES[p.period]}</span>
                        {isCurrent && (
                          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                            진행 중
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 sm:py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <CalendarDays className="w-7 h-7 mx-auto text-slate-300" />
                <p>오늘 등록된 수업 일정이 없습니다.</p>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-black/[0.04]">
            <button
              onClick={() => onNavigate('timetable')}
              className="w-full py-3.5 rounded-2xl bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-98 text-slate-800 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-black/[0.03]"
            >
              <span>주간 시간표 전체보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom 2-Column Bento Grid: Academic Schedule D-Day & Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bento 3: 공식 학사일정 D-Day 레이더 */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">공식 학사일정 D-Day</h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">NEIS 시험 및 방학 일정</span>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                실시간 집계
              </span>
            </div>

            <div className="mt-4 sm:mt-5 space-y-2.5">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl sm:rounded-2xl bg-[#F5F5F7] border border-black/[0.02] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-black/[0.04]">
                          {evt.typeLabel || '학사'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{evt.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{evt.title}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-black px-3 py-1 rounded-xl border ${
                          evt.dDay === 0
                            ? 'bg-rose-500 text-white border-rose-600'
                            : evt.dDay <= 14
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-white text-indigo-700 border-black/[0.06]'
                        }`}
                      >
                        {evt.dDay === 0 ? 'D-Day' : `D-${evt.dDay}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 sm:py-8 text-center text-slate-400 text-xs font-medium">
                  예정된 주요 학사일정이 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-black/[0.04]">
            <button
              onClick={() => onNavigate('schedule')}
              className="w-full py-3.5 rounded-2xl bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-98 text-slate-800 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-black/[0.03]"
            >
              <span>연간 공식 학사일정 전체보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bento 4: 학생 게시판 바로가기 */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">학생 소통 게시판</h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    서대전고 재학생 의견 나눔
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
                게시판
              </span>
            </div>

            <div className="mt-4 sm:mt-5 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                급식, 시설 개선, 학사일정, 동아리 활동 등 학교 생활에 관한 생각과 제안을 자유롭게 나누어보세요.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {['급식 제안', '시설/환경', '학사/수업', '동아리/자치', '자유의견'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-[#F5F5F7] text-slate-700 text-xs font-semibold border border-black/[0.02]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-black/[0.04]">
            <button
              onClick={() => onNavigate('board')}
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-slate-800 active:scale-98 text-white text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>학생 게시판 바로가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
