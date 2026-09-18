import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  Edit3,
  X,
  Camera,
} from 'lucide-react';
import { ExamScopeItem, getExamScopes, saveExamScope } from '../services/assessmentService';
import ExamScopeOcrModal from './ExamScopeOcrModal';

interface ExamScopeSectionProps {
  grade: number;
}

export default function ExamScopeSection({ grade }: ExamScopeSectionProps) {
  const [scopes, setScopes] = useState<ExamScopeItem[]>(() => getExamScopes(grade));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'announced' | 'pending'>('all');
  const [editingItem, setEditingItem] = useState<ExamScopeItem | null>(null);
  const [isOcrOpen, setIsOcrOpen] = useState(
    () => new URLSearchParams(window.location.search).get('openOcr') === 'true'
  );

  const filteredScopes = scopes.filter((item) => {
    const matchesQuery = item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'announced') return matchesQuery && item.status === 'announced';
    if (filterStatus === 'pending') return matchesQuery && item.status === 'pending';
    return matchesQuery;
  });

  const announcedCount = scopes.filter((s) => s.status === 'announced').length;
  const pendingCount = scopes.filter((s) => s.status === 'pending').length;

  const handleSaveEdit = (updated: ExamScopeItem) => {
    saveExamScope(updated);
    setScopes(getExamScopes(grade));
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-800 text-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/20 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              2학기 1차 지필평가 (중간고사)
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              9월 22일(월) 전체 공지 예정
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            {grade}학년 2학기 중간고사 시험범위 안내
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            월요일 교무실 및 과목별 선생님 공식 공지에 맞추어 실시간 업데이트됩니다.
            현재 학생들을 위한 안내 공간이 사전 확보되어 있습니다.
          </p>

          {/* Quick Stats Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-medium text-white flex items-center gap-2 border border-white/10">
              <span className="text-slate-400">총 평가 과목:</span>
              <strong className="font-bold">{scopes.length}과목</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-xs font-medium text-emerald-300 flex items-center gap-2 border border-emerald-400/20">
              <span>공지 완료:</span>
              <strong className="font-bold">{announcedCount}과목</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-xs font-medium text-amber-300 flex items-center gap-2 border border-amber-400/20">
              <span>9/22 공지 대기:</span>
              <strong className="font-bold">{pendingCount}과목</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Official Notice Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">선생님 전달 공지사항 (공간 사전 확보 안내)</div>
          <div className="text-amber-900/90 leading-relaxed font-medium">
            "시험범위는 월요일 1교시 전체 공지 예정이며, 공지 즉시 교과 담당 선생님께서 본 포털에 직접 범위를 확정 등록합니다. 아직 미공지된 과목은 [공지 대기] 카드로 안전하게 대기 중입니다."
          </div>
        </div>
      </div>

      {/* Filter & Search Bar + OCR Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 max-w-lg">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="과목명 검색 (화학, 문학, 미적2 등)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* AI OCR Button */}
          <button
            type="button"
            onClick={() => setIsOcrOpen(true)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white shadow-xs flex items-center gap-2 cursor-pointer transition shrink-0 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>📸 AI 칠판·공지문 OCR</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-[#F5F5F7] p-1.5 rounded-xl border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            전체 ({scopes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('announced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'announced'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            공지 완료 ({announcedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            공지 대기 ({pendingCount})
          </button>
        </div>
      </div>

      {/* Scope Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScopes.map((scope) => {
          const isAnnounced = scope.status === 'announced';

          return (
            <motion.div
              key={scope.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 sm:p-6 rounded-[24px] border transition relative flex flex-col justify-between ${
                isAnnounced
                  ? 'bg-white border-indigo-200/80 shadow-[0_2px_12px_rgba(79,70,229,0.06)]'
                  : 'bg-white border-dashed border-slate-300/80 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {scope.subject}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {grade}학년 정규 지필평가 과목
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isAnnounced ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>공지 완료</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>9/22(월) 공지 예정</span>
                      </span>
                    )}

                    {/* Quick Edit button for demo/teacher */}
                    <button
                      type="button"
                      onClick={() => setEditingItem(scope)}
                      title="시험범위 등록/수정"
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scope Content */}
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium ${
                    isAnnounced
                      ? 'bg-indigo-50/50 border-indigo-100 text-slate-800'
                      : 'bg-[#F5F5F7]/80 border-black/[0.04] text-slate-500'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-400 mb-1">
                    {isAnnounced ? '📖 교과서 및 출제 범위' : '⏳ 공지 상태 안내'}
                  </div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {scope.scope}
                  </div>
                  {scope.textbookPages && scope.textbookPages !== '공지 대기 중' && (
                    <div className="text-xs text-indigo-700 font-semibold mt-1">
                      페이지: {scope.textbookPages}
                    </div>
                  )}
                </div>

                {/* Supplementary & Notes */}
                {scope.supplementary && (
                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-black/[0.02]">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-700">부교재/인쇄물:</strong> {scope.supplementary}
                    </div>
                  </div>
                )}

                {scope.notice && (
                  <div className="text-xs text-slate-500 font-medium pl-1">
                    ※ {scope.notice}
                  </div>
                )}
              </div>

              {/* Updated At */}
              <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-slate-400">
                <span>서대전고 교무실 안내 공간</span>
                <span>{scope.updatedAt || '9/18 확보'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Modal (For Teachers / Simulation) */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/[0.06] z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                <h3 className="font-bold text-slate-900 text-base">
                  [{editingItem.subject}] 시험범위 등록 및 수정
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">공지 상태</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, status: 'announced' })}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        editingItem.status === 'announced'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-[#F5F5F7] text-slate-700'
                      }`}
                    >
                      공지 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, status: 'pending' })}
                      className={`flex-1 py-2 rounded-xl font-bold border transition ${
                        editingItem.status === 'pending'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-[#F5F5F7] text-slate-700'
                      }`}
                    >
                      공지 대기 (9/22)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">시험범위 (교과서 단원 등)</label>
                  <input
                    type="text"
                    value={editingItem.scope || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, scope: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">부교재 / 유인물</label>
                  <input
                    type="text"
                    value={editingItem.supplementary || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, supplementary: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">안내 유의사항</label>
                  <input
                    type="text"
                    value={editingItem.notice || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, notice: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSaveEdit({
                      ...editingItem,
                      updatedAt: '방금 전 수정',
                    })
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI OCR Blackboard Modal */}
      <ExamScopeOcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onSaveScope={handleSaveEdit}
        grade={grade}
      />
    </div>
  );
}
