import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  X,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { AssessmentInfo } from '../services/assessmentService';

interface AssessmentDetailModalProps {
  assessment: AssessmentInfo | null;
  onClose: () => void;
}

export default function AssessmentDetailModal({
  assessment,
  onClose,
}: AssessmentDetailModalProps) {
  if (!assessment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-black/[0.06] overflow-hidden z-10 my-6"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
                <FileText className="w-3.5 h-3.5" />
                <span>수행평가 상세 안내</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/90 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-violet-200">
                  {assessment.grade}학년 {assessment.classNum ? `${assessment.classNum}반` : '전체'} · {assessment.day}요일 {assessment.period}교시
                </span>
                <span className="px-2 py-0.5 rounded-md bg-violet-500/40 text-xs font-bold border border-violet-300/30">
                  {assessment.type}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                [{assessment.subject}] {assessment.title}
              </h3>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.02]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>평가 일시</span>
                </div>
                <div className="mt-1 text-sm font-bold text-slate-800">
                  {assessment.dueDate || `${assessment.day}요일 ${assessment.period}교시`}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.02]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Percent className="w-3.5 h-3.5 text-slate-500" />
                  <span>학기 반영 비율</span>
                </div>
                <div className="mt-1 text-sm font-bold text-violet-700">
                  {assessment.weight}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>담당 선생님</span>
                </div>
                <div className="mt-1 text-sm font-bold text-slate-800">
                  {assessment.teacher ? `${assessment.teacher} 선생님` : '교과 담당 교사'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>평가 내용 및 채점 기준</span>
              </h4>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-sm text-slate-800 leading-relaxed font-medium">
                {assessment.description}
              </div>
            </div>

            {/* Materials */}
            {assessment.materials && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>준비물 및 지참 안내</span>
                </h4>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-sm text-emerald-950 font-semibold">
                  {assessment.materials}
                </div>
              </div>
            )}

            {/* Notice */}
            {assessment.notice && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <strong>선생님 전달 사항:</strong> {assessment.notice}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-black/[0.04] flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold transition cursor-pointer"
            >
              확인
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
