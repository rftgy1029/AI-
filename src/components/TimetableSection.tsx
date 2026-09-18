import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  BookOpen,
  RefreshCw,
  ChevronRight,
  Info,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  List,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TimetableDay, UserProfile } from '../types';
import {
  getCurrentPeriodInfo,
  CurrentPeriodInfo,
  SEODAEJEON_BELL_SCHEDULE,
} from '../utils/datetime';
import { PERIOD_TIMES, getOfficialSeodaejeonTimetable } from '../services/neisService';

interface TimetableSectionProps {
  timetable: Record<string, TimetableDay[]>;
  currentUser: UserProfile;
  onChangeClass?: (grade: number, classNum: number) => void;
  isNeisSyncing?: boolean;
  onRefreshNeis?: () => void;
  lastSyncTime?: string;
}

export default function TimetableSection({
  timetable,
  currentUser,
  onChangeClass,
  isNeisSyncing,
  onRefreshNeis,
  lastSyncTime,
}: TimetableSectionProps) {
  const [periodInfo, setPeriodInfo] = useState<CurrentPeriodInfo>(() => getCurrentPeriodInfo());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const timer = setInterval(() => {
      setPeriodInfo(getCurrentPeriodInfo(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayIndexMap: Record<string, number> = { 월: 0, 화: 1, 수: 2, 목: 3, 금: 4 };
  const currentKstDay = periodInfo.dayOfWeek;
  const defaultDayIndex = dayIndexMap[currentKstDay] ?? 0;

  const [selectedGrade, setSelectedGrade] = useState(currentUser.grade || 2);
  const [selectedClass, setSelectedClass] = useState(currentUser.classNum || 1);
  const [activeDayIndex, setActiveDayIndex] = useState(defaultDayIndex);

  useEffect(() => {
    setSelectedGrade(currentUser.grade || 2);
    setSelectedClass(currentUser.classNum || 1);
  }, [currentUser.grade, currentUser.classNum]);

  const handleGradeChange = (g: number) => {
    setSelectedGrade(g);
    onChangeClass?.(g, selectedClass);
  };

  const handleClassChange = (c: number) => {
    setSelectedClass(c);
    onChangeClass?.(selectedGrade, c);
  };

  const classKey = `${selectedGrade}-${selectedClass}`;
  const days =
    timetable[classKey] && timetable[classKey].length > 0 && timetable[classKey].some(d => d.periods.length > 0)
      ? timetable[classKey]
      : getOfficialSeodaejeonTimetable(selectedGrade, selectedClass)[classKey] || [];

  const currentDayData = days[activeDayIndex] || days[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Grade/Class Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                교육부 NEIS hisTimetable 연동
              </span>

              {periodInfo.isSchoolHours && !periodInfo.isWeekend && periodInfo.activePeriodNumber ? (
                <span className="text-[10px] sm:text-xs font-bold text-white bg-indigo-600 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  현재 {periodInfo.activePeriodNumber}교시 진행 중
                </span>
              ) : periodInfo.isWeekend ? (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full border border-black/[0.03]">
                  주말 (휴업일)
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full border border-black/[0.03]">
                  일과 외 시간
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              서대전고등학교 정규 학급 시간표
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              서대전고등학교 학년 및 학급별 공식 교과목 시간표와 1~7교시 일과표를 실시간으로 안내합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-1 sm:pt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  viewMode === 'daily'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-4 h-4" />
                <span>일간 상세</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  viewMode === 'weekly'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>주간 전체</span>
              </button>
            </div>

            {onRefreshNeis && (
              <button
                type="button"
                onClick={onRefreshNeis}
                disabled={isNeisSyncing}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-95 text-slate-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-black/[0.04]"
              >
                <RefreshCw className={`w-4 h-4 ${isNeisSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{isNeisSyncing ? '조회 중...' : '시간표 새로고침'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Grade & Class Switcher Chips - touch-friendly wrap with large readable font */}
        <div className="mt-5 pt-5 border-t border-black/[0.04] space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-slate-500 w-16 shrink-0">학년 선택</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((g) => (
                <button
                  key={g}
                  onClick={() => handleGradeChange(g)}
                  className={`px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition cursor-pointer active:scale-95 border ${
                    selectedGrade === g
                      ? 'bg-black text-white border-black shadow-2xs'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700 border-black/[0.02]'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xs sm:text-sm font-bold text-slate-500 w-16 shrink-0 pt-1.5">학급 선택</span>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                <button
                  key={c}
                  onClick={() => handleClassChange(c)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm sm:text-base font-bold transition cursor-pointer active:scale-95 border ${
                    selectedClass === c
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700 border-black/[0.02]'
                  }`}
                >
                  {c}반
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Day Tabs (Only in daily view) */}
        {viewMode === 'daily' && days.length > 0 && (
          <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-5 pt-5 border-t border-black/[0.04]">
            {days.map((dayItem, idx) => {
              const isSelected = idx === activeDayIndex;
              const isToday = !periodInfo.isWeekend && dayItem.day === periodInfo.dayOfWeek;

              return (
                <button
                  key={dayItem.day}
                  type="button"
                  onClick={() => setActiveDayIndex(idx)}
                  className={`py-3 px-2 sm:py-3.5 sm:px-4 rounded-2xl text-center transition-all cursor-pointer border select-none active:scale-95 ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/70 border-black/[0.02] text-slate-800'
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold block">{dayItem.day}요일</span>
                  {dayItem.dateStr && (
                    <span className={`text-xs sm:text-sm block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {dayItem.dateStr.slice(5)}
                    </span>
                  )}
                  {isToday && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-black inline-block mt-0.5 ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      오늘
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Main Timetable Content */}
      {viewMode === 'daily' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Periods for the selected day */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {selectedGrade}학년 {selectedClass}반 {currentDayData?.day}요일 시간표
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {currentDayData?.day === '월'
                      ? '월요일 1교시 수업 없음 (2교시~7교시 총 6시간)'
                      : `총 ${currentDayData?.periods?.length || 0}교시 정규 교과`}
                  </p>
                </div>

                <span className="text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
                  {selectedGrade}학년 {selectedClass}반
                </span>
              </div>

              {/* Notice for Monday 1st period absence */}
              {currentDayData?.day === '월' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-amber-900 font-medium">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>서대전고등학교는 월요일 1교시 수업이 없으며 2교시(09:20)부터 진행됩니다.</span>
                </div>
              )}

              {/* Notice for timetable change if present in this day */}
              {currentDayData?.periods?.some((p) => p.isChanged) && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-xs sm:text-sm text-amber-950 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                  <span>
                    <strong>시간표 변경 안내:</strong> 노란색 박스는 변경된 수업입니다 (원래 진로 시간에서 변경됨).
                  </span>
                </div>
              )}

              {currentDayData?.periods?.length ? (
                <div className="space-y-2.5">
                  {currentDayData.periods.map((p) => {
                    const isCurrent =
                      !periodInfo.isWeekend &&
                      currentDayData.day === periodInfo.dayOfWeek &&
                      periodInfo.activePeriodNumber === p.period;

                    return (
                      <motion.div
                        key={p.period}
                        whileHover={{ scale: 1.005 }}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                          p.isChanged
                            ? 'bg-amber-50/90 border-2 border-amber-400 shadow-xs'
                            : isCurrent
                            ? 'bg-indigo-50/80 border-indigo-200 font-semibold shadow-2xs'
                            : 'bg-[#F5F5F7] border-black/[0.02] hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                              p.isChanged
                                ? 'bg-amber-400 text-amber-950 border border-amber-500/30'
                                : isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 border border-black/[0.06]'
                            }`}
                          >
                            {p.period}
                          </span>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-bold truncate ${
                                  p.isChanged
                                    ? 'text-amber-950 font-black'
                                    : isCurrent
                                    ? 'text-indigo-950'
                                    : 'text-slate-900'
                                }`}
                              >
                                {p.subject}
                              </h4>
                              {p.teacher && (
                                <span className="text-xs text-slate-500 font-medium bg-white/80 px-2 py-0.5 rounded-md border border-black/[0.04]">
                                  {p.teacher} 선생님
                                </span>
                              )}
                              {p.isChanged && (
                                <span className="text-[11px] font-extrabold text-amber-950 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300">
                                  시간표 변경 (원래: {p.originalSubject || '진로'})
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {p.timeRange || PERIOD_TIMES[p.period]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                              진행 중
                            </span>
                          )}
                          <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-xl border border-black/[0.04]">
                            {selectedClass}반 교실
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                  <CalendarDays className="w-8 h-8 mx-auto text-slate-300" />
                  <p>등록된 시간표 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Bell Schedule */}
          <div className="space-y-6">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.04]">
                <Clock className="w-4 h-4 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">정규 일과표 (컴시간 공식)</h3>
                  <span className="text-[10px] text-slate-400">1교시 08:20 시작 / 50분 수업</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">등교 및 아침 자습</span>
                  <span className="font-bold text-slate-900 font-mono">08:00 ~ 08:20</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">1교시</span>
                  <span className="font-bold text-slate-900 font-mono">08:20 ~ 09:10</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">2교시</span>
                  <span className="font-bold text-slate-900 font-mono">09:20 ~ 10:10</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">3교시</span>
                  <span className="font-bold text-slate-900 font-mono">10:20 ~ 11:10</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">4교시</span>
                  <span className="font-bold text-slate-900 font-mono">11:20 ~ 12:10</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-orange-50/70 border border-orange-200/50">
                  <span className="font-bold text-orange-900">🍱 점심시간 & 방송</span>
                  <span className="font-bold text-orange-900 font-mono">12:10 ~ 13:10</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">5교시</span>
                  <span className="font-bold text-slate-900 font-mono">13:10 ~ 14:00</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">6교시</span>
                  <span className="font-bold text-slate-900 font-mono">14:10 ~ 15:00</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">7교시</span>
                  <span className="font-bold text-slate-900 font-mono">15:10 ~ 16:00</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">종례 및 청소</span>
                  <span className="font-bold text-slate-900 font-mono">16:00 ~ 16:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly Full 5-Day Grid View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.04] gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {selectedGrade}학년 {selectedClass}반 주간 전체 시간표 (월~금)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                월요일부터 금요일까지 1~7교시 정규 교과 수업을 한눈에 확인하세요.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                노란색: 시간표 변경 (원래 진로)
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                {selectedGrade}학년 {selectedClass}반
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-xs text-center border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="py-3.5 px-3 bg-[#F5F5F7] font-bold text-slate-700 rounded-tl-2xl w-24">
                    교시 / 시간
                  </th>
                  {days.map((d, dIdx) => {
                    const isToday = !periodInfo.isWeekend && d.day === periodInfo.dayOfWeek;
                    return (
                      <th
                        key={d.day}
                        className={`py-3.5 px-3 font-bold transition ${
                          isToday
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#F5F5F7] text-slate-800'
                        } ${dIdx === days.length - 1 ? 'rounded-tr-2xl' : ''}`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{d.day}요일</span>
                          {isToday && (
                            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                              오늘
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                  return (
                    <tr key={pNum} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-2 bg-[#F5F5F7]/80 text-left font-semibold text-slate-700 border-r border-black/[0.04]">
                        <div className="font-bold text-slate-900">{pNum}교시</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {PERIOD_TIMES[pNum]}
                        </div>
                      </td>

                      {days.map((d) => {
                        const periodData = d.periods.find((p) => p.period === pNum);
                        const isCurrent =
                          !periodInfo.isWeekend &&
                          d.day === periodInfo.dayOfWeek &&
                          periodInfo.activePeriodNumber === pNum;
                        const isMondayPeriod1 = d.day === '월' && pNum === 1;
                        const isChanged = periodData?.isChanged;

                        return (
                          <td
                            key={d.day}
                            className={`py-3.5 px-2 transition ${
                              isChanged
                                ? 'bg-amber-200/90 font-black text-amber-950 border-2 border-amber-400 shadow-xs'
                                : isCurrent
                                ? 'bg-indigo-50/80 font-bold text-indigo-950 border-2 border-indigo-300'
                                : isMondayPeriod1
                                ? 'bg-slate-50/60'
                                : 'text-slate-800 font-medium'
                            }`}
                          >
                            {isMondayPeriod1 ? (
                              <div className="py-1">
                                <span className="inline-block text-slate-400 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/50">
                                  수업 없음
                                </span>
                              </div>
                            ) : periodData ? (
                              <div className="space-y-1">
                                <div
                                  className={`truncate font-bold text-sm ${
                                    isChanged ? 'text-amber-950 font-black text-base' : 'text-slate-900'
                                  }`}
                                >
                                  {periodData.subject}
                                </div>
                                {periodData.teacher && (
                                  <div
                                    className={`text-[11px] font-medium ${
                                      isChanged ? 'text-amber-900 font-bold' : 'text-slate-500'
                                    }`}
                                  >
                                    ({periodData.teacher})
                                  </div>
                                )}
                                {isChanged && (
                                  <div className="pt-0.5">
                                    <span className="inline-block text-[9px] font-extrabold text-amber-950 bg-amber-300 px-1.5 py-0.5 rounded border border-amber-400">
                                      원래: {periodData.originalSubject || '진로'}
                                    </span>
                                  </div>
                                )}
                                {isCurrent && !isChanged && (
                                  <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                                    진행 중
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
