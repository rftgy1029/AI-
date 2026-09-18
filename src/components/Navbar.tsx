import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  ChevronDown,
  Utensils,
  CalendarDays,
  Calendar,
  Building,
  Home,
  Users,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenClassChange: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenClassChange,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState('');
  const [periodStatus, setPeriodStatus] = useState('실시간 학사');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTimeStr(formatter.format(now));

      // Current period estimate based on KST hours/minutes
      const kstTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).format(now);
      const [h, m] = kstTime.split(':').map(Number);
      const totalMinutes = h * 60 + m;

      if (totalMinutes < 9 * 60) setPeriodStatus('등교 및 아침 자습');
      else if (totalMinutes < 9 * 60 + 50) setPeriodStatus('1교시');
      else if (totalMinutes < 10 * 60) setPeriodStatus('쉬는 시간');
      else if (totalMinutes < 10 * 60 + 50) setPeriodStatus('2교시');
      else if (totalMinutes < 11 * 60) setPeriodStatus('쉬는 시간');
      else if (totalMinutes < 11 * 60 + 50) setPeriodStatus('3교시');
      else if (totalMinutes < 12 * 60) setPeriodStatus('쉬는 시간');
      else if (totalMinutes < 12 * 60 + 50) setPeriodStatus('4교시');
      else if (totalMinutes < 13 * 60 + 50) setPeriodStatus('🍱 점심');
      else if (totalMinutes < 14 * 60 + 40) setPeriodStatus('5교시');
      else if (totalMinutes < 15 * 60 + 40) setPeriodStatus('6교시');
      else if (totalMinutes < 16 * 60 + 40) setPeriodStatus('7교시');
      else setPeriodStatus('방과후');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: '홈', fullLabel: '홈 (대시보드)', icon: Home },
    { id: 'meal', label: '급식', fullLabel: '급식표 (NEIS)', icon: Utensils },
    { id: 'timetable', label: '시간표', fullLabel: '시간표 (컴시간)', icon: CalendarDays },
    { id: 'schedule', label: '일정', fullLabel: '학사일정 · D-Day', icon: Calendar },
    { id: 'board', label: '게시판', fullLabel: '게시판', icon: MessageSquare },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F7]/90 backdrop-blur-2xl border-b border-black/[0.06] transition-all duration-200">
        {/* Top Status Bar */}
        <div className="border-b border-black/[0.04] bg-white/60 text-[11px] text-slate-500 py-1.5 px-3.5 sm:px-6 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1.5 text-slate-700 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 text-xs sm:text-sm">서대전고</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-bold truncate text-[11px]">
                {periodStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1 font-mono text-slate-700">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{timeStr || '실시간 KST'}</span>
              </div>

              <button
                type="button"
                onClick={onOpenClassChange}
                className="text-[11px] font-bold text-slate-700 bg-white/90 hover:bg-white active:scale-95 px-2.5 py-1 rounded-full border border-black/[0.08] transition flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Users className="w-3 h-3 text-indigo-600" />
                <span>{currentUser.grade}-{currentUser.classNum}반</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Header / Brand Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">
                  서대전고 포털
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/50">
                  NEIS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                실시간 급식 · 시간표 · 학사일정
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'text-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.03]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 rounded-full bg-white shadow-xs border border-black/[0.08]"
                      transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="relative z-10">{item.fullLabel}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Mobile Fast Class Indicator */}
          <div className="flex md:hidden items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">
              {timeStr.slice(timeStr.lastIndexOf(' ') + 1, timeStr.lastIndexOf(':')) || ''}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile thumb reach) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-black/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[56px] transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center relative">
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavActivePill"
                      className="absolute inset-0 bg-indigo-50 rounded-xl shadow-2xs border border-indigo-100/60"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-105 text-indigo-600' : 'text-slate-500'}`} />
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="mobileActiveDot"
                    className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

