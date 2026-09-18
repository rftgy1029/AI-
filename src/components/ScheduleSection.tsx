import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Search,
  Filter,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Palmtree,
  Calendar,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AcademicEvent } from '../types';

interface ScheduleSectionProps {
  events: AcademicEvent[];
  isNeisSyncing?: boolean;
  isAdmin?: boolean;
  onOpenAddSchedule?: () => void;
  onDeleteSchedule?: (id: string) => void;
}

export default function ScheduleSection({
  events,
  isNeisSyncing,
  isAdmin = false,
  onOpenAddSchedule,
  onDeleteSchedule,
}: ScheduleSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'exam' | 'test' | 'vacation' | 'holiday'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter((evt) => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'exam' && evt.category !== 'exam') return false;
      if (selectedFilter === 'test' && evt.category !== 'test') return false;
      if (selectedFilter === 'vacation' && evt.category !== 'vacation') return false;
      if (selectedFilter === 'holiday' && evt.category !== 'holiday') return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        evt.title.toLowerCase().includes(term) ||
        evt.date.includes(term) ||
        (evt.typeLabel && evt.typeLabel.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // 다가오는 주요 D-Day 3개 (가장 가까운 D-Day 순 정렬)
  const upcomingEvents = events
    .filter((e) => e.dDay >= 0)
    .sort((a, b) => a.dDay - b.dDay)
    .slice(0, 3);

  const getCategoryBadge = (cat: AcademicEvent['category']) => {
    switch (cat) {
      case 'exam':
        return { label: '지필평가', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: BookOpen };
      case 'test':
        return { label: '학력평가/수능', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: GraduationCap };
      case 'vacation':
        return { label: '방학/개학/행사', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Palmtree };
      case 'holiday':
        return { label: '공휴일', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Calendar };
      default:
        return { label: '학사행사', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: CalendarDays };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                NEIS 공식 연동
              </span>
              <span className="text-xs text-slate-400 font-medium">서대전고등학교 2025~2026학년도</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">공식 학사일정 및 D-Day</h2>
            <p className="text-xs text-slate-500 font-medium">
              교육부 NEIS(교육행정정보시스템)에 공식 등록된 시험, 학력평가, 방학 일정을 실시간으로 안내합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAddSchedule}
                className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 학사일정 등록</span>
              </button>
            )}
            <span className="text-xs font-semibold text-slate-600 bg-[#F5F5F7] px-3 py-1.5 rounded-full border border-black/[0.03]">
              총 {events.length}건 등록됨
            </span>
          </div>
        </div>

        {/* Admin Notification Banner */}
        {isAdmin && (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="text-xs text-indigo-950 font-medium">
                <span className="font-bold text-indigo-900">교무실 관리자 권한 활성화됨:</span> 시험, 축제, 모의고사 일정을 직접 등록하거나 삭제할 수 있습니다.
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAddSchedule}
              className="self-start sm:self-auto text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>일정 바로 등록하기</span>
            </button>
          </div>
        )}

        {/* Top 3 Upcoming D-Day Cards */}
        {upcomingEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-black/[0.04]">
            {upcomingEvents.map((evt) => {
              const badge = getCategoryBadge(evt.category);
              const Icon = badge.icon;
              return (
                <motion.div
                  key={evt.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5F5F7] border border-black/[0.03] flex items-center justify-between gap-3 hover:bg-slate-100/80 transition cursor-default shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{evt.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">{evt.date}</p>
                  </div>

                  <div className="text-right shrink-0 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-black/[0.04] shadow-2xs">
                    <span className="text-xs sm:text-sm font-black text-rose-500">
                      {evt.dDay === 0 ? 'D-Day' : `D-${evt.dDay}`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Filter and Search Bar - Mobile scrollable tags */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 sm:p-3 rounded-2xl border border-black/[0.04] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(
            [
              { key: 'all', label: '전체' },
              { key: 'exam', label: '지필평가' },
              { key: 'test', label: '모의고사/수능' },
              { key: 'vacation', label: '방학/개학' },
              { key: 'holiday', label: '공휴일' },
            ] as const
          ).map((filter) => (
            <motion.button
              key={filter.key}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter.key)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 select-none ${
                selectedFilter === filter.key
                  ? 'text-white'
                  : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {selectedFilter === filter.key && (
                <motion.div
                  layoutId="scheduleCategoryPill"
                  className="absolute inset-0 bg-black rounded-xl shadow-2xs"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10">{filter.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="학사일정 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F7] rounded-xl border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none transition"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
            <CalendarDays className="w-8 h-8 mx-auto text-slate-300" />
            <p>조건에 맞는 학사일정이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((evt) => {
                const badge = getCategoryBadge(evt.category);
                const Icon = badge.icon;
                const isPast = evt.dDay < 0;
                const isToday = evt.dDay === 0;

                return (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.005, y: -1 }}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isToday
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-2xs'
                        : isPast
                        ? 'bg-slate-50/50 border-slate-200/60 opacity-60'
                        : 'bg-[#F5F5F7] border-black/[0.02] hover:bg-slate-100/80'
                    }`}
                  >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {evt.isCustom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 border border-indigo-200">
                            교무실 등록
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">{evt.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{evt.title}</h4>
                      {evt.description && (
                        <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{evt.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    {isAdmin && evt.isCustom && onDeleteSchedule && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`'${evt.title}' 일정을 삭제하시겠습니까?`)) {
                            onDeleteSchedule(evt.id);
                          }
                        }}
                        title="학사일정 삭제"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <span
                      className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                        isToday
                          ? 'bg-rose-500 text-white border-rose-600'
                          : isPast
                          ? 'bg-slate-200 text-slate-500 border-slate-300'
                          : evt.dDay <= 14
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-white text-indigo-700 border-black/[0.06]'
                      }`}
                    >
                      {isToday ? '오늘 (D-Day)' : isPast ? `${Math.abs(evt.dDay)}일 전 종료` : `D-${evt.dDay}`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        )}
      </div>
    </div>
  );
}
