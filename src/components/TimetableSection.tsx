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
  const [selectedClass, setSelectedClass] = useState(currentUser.classNum || 3);
  const [activeDayIndex, setActiveDayIndex] = useState(defaultDayIndex);

  useEffect(() => {
    setSelectedGrade(currentUser.grade || 2);
    setSelectedClass(currentUser.classNum || 3);
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
            <div className="flex items-center p-1 bg-[#F5F5F7] rounded-full border border-black/[0.03]">
              <button
                type="button"
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  viewMode === 'daily'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>일간 상세</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  viewMode === 'weekly'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>주간 전체</span>
              </button>
            </div>

            {onRefreshNeis && (
              <button
                type="button"
                onClick={onRefreshNeis}
                disabled={isNeisSyncing}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-95 text-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isNeisSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">{isNeisSyncing ? '조회 중...' : '새로고침'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Grade & Class Switcher Chips - touch-friendly wrap */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-black/[0.04] space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 w-14 shrink-0">학년 선택</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((g) => (
                <button
                  key={g}
                  onClick={() => handleGradeChange(g)}
                  className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-bold transition cursor-pointer active:scale-95 ${
                    selectedGrade === g
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 w-14 shrink-0 pt-1">학급 선택</span>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                <button
                  key={c}
                  onClick={() => handleClassChange(c)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer active:scale-95 ${
                    selectedClass === c
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700'
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
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-black/[0.04]">
            {days.map((dayItem, idx) => {
              const isSelected = idx === activeDayIndex;
              const isToday = !periodInfo.isWeekend && dayItem.day === periodInfo.dayOfWeek;

              return (
                <button
                  key={dayItem.day}
                  type="button"
                  onClick={() => setActiveDayIndex(idx)}
                  className={`py-2 px-1 sm:p-3 rounded-xl sm:rounded-2xl text-center transition-all cursor-pointer border select-none active:scale-95 ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-[#F5F5F7] hover:bg-slate-200/70 border-black/[0.02] text-slate-700'
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-bold block">{dayItem.day}</span>
                  {dayItem.dateStr && (
                    <span className={`text-[10px] block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {dayItem.dateStr.slice(5)}
                    </span>
                  )}
                  {isToday && (
                    <span
                      className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded-full font-bold inline-block mt-0.5 ${
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
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedGrade}학년 {selectedClass}반 {currentDayData?.day}요일 시간표
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    총 {currentDayData?.periods?.length || 0}교시 교과 과정
                  </p>
                </div>

                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  {selectedGrade}학년 {selectedClass}반
                </span>
              </div>

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
                          isCurrent
                            ? 'bg-indigo-50/80 border-indigo-200 font-semibold shadow-2xs'
                            : 'bg-[#F5F5F7] border-black/[0.02] hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                              isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 border border-black/[0.06]'
                            }`}
                          >
                            {p.period}
                          </span>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-bold truncate ${
                                isCurrent ? 'text-indigo-950' : 'text-slate-900'
                              }`}
                            >
                              {p.subject}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium">
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
                <h3 className="font-bold text-slate-900 text-sm">정규 일과표 (종소리 기준)</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">아침 등교 및 자습</span>
                  <span className="font-bold text-slate-900 font-mono">08:00 ~ 08:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">1교시</span>
                  <span className="font-bold text-slate-900 font-mono">09:00 ~ 09:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">2교시</span>
                  <span className="font-bold text-slate-900 font-mono">10:00 ~ 10:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">3교시</span>
                  <span className="font-bold text-slate-900 font-mono">11:00 ~ 11:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">4교시</span>
                  <span className="font-bold text-slate-900 font-mono">12:00 ~ 12:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-orange-50/70 border border-orange-200/50">
                  <span className="font-bold text-orange-900">🍱 점심시간 & 휴식</span>
                  <span className="font-bold text-orange-900 font-mono">12:50 ~ 13:50</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">5교시</span>
                  <span className="font-bold text-slate-900 font-mono">13:50 ~ 14:40</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">6교시</span>
                  <span className="font-bold text-slate-900 font-mono">14:50 ~ 15:40</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">7교시</span>
                  <span className="font-bold text-slate-900 font-mono">15:50 ~ 16:40</span>
                </div>
                <div className="flex justify-between py-1.5 px-3 rounded-xl bg-[#F5F5F7]">
                  <span className="font-medium text-slate-600">종례 및 청소</span>
                  <span className="font-bold text-slate-900 font-mono">16:40 ~ 17:00</span>
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
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {selectedGrade}학년 {selectedClass}반 주간 전체 시간표 (월~금)
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                월요일부터 금요일까지 1~7교시 정규 교과 수업을 한눈에 확인하세요.
              </p>
            </div>

            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              {selectedGrade}학년 {selectedClass}반
            </span>
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

                        return (
                          <td
                            key={d.day}
                            className={`py-3 px-2 transition ${
                              isCurrent
                                ? 'bg-indigo-50/80 font-bold text-indigo-950 border-2 border-indigo-300'
                                : 'text-slate-800 font-medium'
                            }`}
                          >
                            {periodData ? (
                              <div className="space-y-0.5">
                                <div className="truncate font-semibold">{periodData.subject}</div>
                                {isCurrent && (
                                  <span className="inline-block text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-full">
                                    진행 중
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[11px]">-</span>
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
