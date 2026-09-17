import { useState, type FormEvent } from 'react';
import {
  X,
  CalendarPlus,
  Calendar,
  BookOpen,
  GraduationCap,
  Palmtree,
  Sparkles,
  AlertCircle,
  Flag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AcademicEvent } from '../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule: (schedule: Omit<AcademicEvent, 'id' | 'dDay'>) => void;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onAddSchedule,
}: AddScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [category, setCategory] = useState<AcademicEvent['category']>('exam');
  const [description, setDescription] = useState('');
  const [highlight, setHighlight] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('학사일정 명칭을 입력해주세요.');
      return;
    }
    if (!date) {
      setErrorMsg('날짜를 선택해주세요.');
      return;
    }

    let typeLabel = '교무학사';
    if (category === 'exam') typeLabel = '지필평가';
    else if (category === 'test') typeLabel = '학력평가';
    else if (category === 'vacation') typeLabel = '방학/개학';
    else if (category === 'festival') typeLabel = '학교축제';
    else if (category === 'holiday') typeLabel = '휴업일';

    onAddSchedule({
      title: title.trim(),
      date,
      category,
      description: description.trim() || undefined,
      typeLabel,
      highlight,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] flex items-center justify-between bg-[#F5F5F7]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <CalendarPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  새 공식 학사일정 등록
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  관리자 권한으로 시험, 축제, 방학 일정을 등록합니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                학사일정 명칭 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 1학기 1차 지필평가(중간고사), 서전제 축제"
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-medium"
              />
            </div>

            {/* Date & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  일정 날짜 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  일정 구분 (카테고리)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AcademicEvent['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-medium cursor-pointer"
                >
                  <option value="exam">지필평가 (중간·기말고사)</option>
                  <option value="test">모의고사 / 학력평가 / 수능</option>
                  <option value="vacation">방학 / 개학 / 졸업식</option>
                  <option value="festival">학교축제 / 체육대회 / 행사</option>
                  <option value="holiday">재량휴업일 / 공휴일</option>
                  <option value="event">일반 교무·학사 일정</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                상세 안내 및 비고 (선택)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 1~3학년 전교생 대상, 교시별 시험시간표는 추후 공지 예정"
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition resize-none font-medium"
              />
            </div>

            {/* Highlight Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7] border border-black/[0.03]">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  홈 화면 D-Day 카운트다운 우선 표시
                </span>
                <span className="text-[11px] text-slate-500">
                  학생들이 메인 홈 대시보드에서 D-Day로 즉시 확인할 수 있습니다.
                </span>
              </div>
              <input
                type="checkbox"
                checked={highlight}
                onChange={(e) => setHighlight(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-black/[0.05] transition cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 active:scale-98 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>일정 등록 완료</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
