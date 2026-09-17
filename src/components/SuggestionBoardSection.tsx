import { useState, useMemo } from 'react';
import {
  MessageSquarePlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  ThumbsUp,
  MessageSquare,
  Building,
  User,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SuggestionItem, SuggestionCategory, SuggestionStatus, UserProfile } from '../types';
import CreateSuggestionModal from './CreateSuggestionModal';
import SuggestionDetailModal from './SuggestionDetailModal';

interface SuggestionBoardSectionProps {
  suggestions: SuggestionItem[];
  currentUser: UserProfile;
  onCreateSuggestion: (data: Omit<SuggestionItem, 'id'>) => Promise<void>;
  onToggleLike: (id: string, currentlyLiked: boolean) => Promise<void>;
  onDeleteSuggestion: (id: string, pin: string) => Promise<{ success: boolean; message: string }>;
  onAddComment: (
    suggestionId: string,
    comment: { authorName: string; grade: number; classNum: number; content: string }
  ) => Promise<void>;
  onPostReply: (
    suggestionId: string,
    reply: { author: string; content: string; date: string },
    status: '검토중' | '답변완료'
  ) => Promise<void>;
}

const CATEGORIES: SuggestionCategory[] = [
  '전체',
  '급식',
  '시설/환경',
  '학사/수업',
  '학생자치/동아리',
  '기타',
];

export default function SuggestionBoardSection({
  suggestions,
  currentUser,
  onCreateSuggestion,
  onToggleLike,
  onDeleteSuggestion,
  onAddComment,
  onPostReply,
}: SuggestionBoardSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<SuggestionCategory>('전체');
  const [selectedStatus, setSelectedStatus] = useState<'all' | SuggestionStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'resolved'>('latest');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionItem | null>(null);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: suggestions.length,
      pending: suggestions.filter((s) => s.status === '접수대기').length,
      reviewing: suggestions.filter((s) => s.status === '검토중').length,
      resolved: suggestions.filter((s) => s.status === '답변완료').length,
    };
  }, [suggestions]);

  // Filtered & Sorted Suggestions
  const filteredSuggestions = useMemo(() => {
    let result = [...suggestions];

    // Category filter
    if (selectedCategory !== '전체') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((s) => s.status === selectedStatus);
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          s.content.toLowerCase().includes(term) ||
          s.authorName.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'likes') {
        return b.likeCount - a.likeCount;
      }
      if (sortBy === 'resolved') {
        if (a.status === '답변완료' && b.status !== '답변완료') return -1;
        if (a.status !== '답변완료' && b.status === '답변완료') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // default 'latest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [suggestions, selectedCategory, selectedStatus, searchTerm, sortBy]);

  // Active item in modal update
  const activeDetailSuggestion = useMemo(() => {
    if (!selectedSuggestion) return null;
    return suggestions.find((s) => s.id === selectedSuggestion.id) || selectedSuggestion;
  }, [suggestions, selectedSuggestion]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                서대전고 전교생 실명제 운영
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full border border-black/[0.03]">
                책임감 있는 학생 소통 공간
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              서대전고등학교 실명제 건의게시판
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              급식, 학교 시설, 학사 일정, 동아리 등 학교 발전을 위한 건의사항을 실명으로 자유롭게 제안하세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-black text-white hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs sm:text-sm font-bold shadow-sm cursor-pointer active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>건의사항 작성하기</span>
            </button>
          </div>
        </div>

        {/* Status Counters Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 pt-5 border-t border-black/[0.04]">
          {[
            { key: 'all', label: '전체 건의', count: statusCounts.all, color: 'text-slate-900' },
            { key: '답변완료', label: '답변완료', count: statusCounts.resolved, color: 'text-emerald-600' },
            { key: '검토중', label: '검토 진행중', count: statusCounts.reviewing, color: 'text-amber-600' },
            { key: '접수대기', label: '접수대기', count: statusCounts.pending, color: 'text-indigo-600' },
          ].map((tab) => {
            const isSelected = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key as any)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#F5F5F7] border-black/10 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-black/[0.03]'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {tab.label}
                </span>
                <span className={`text-lg sm:text-xl font-black ${tab.color}`}>
                  {tab.count}건
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-black/[0.04] shadow-2xs space-y-3">
        {/* Category horizontal pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 shrink-0 ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-2xs'
                  : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-black/[0.04]">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="건의사항 제목, 내용, 작성자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F7] rounded-xl border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              정렬:
            </span>
            {[
              { key: 'latest', label: '최신순' },
              { key: 'likes', label: '공감순' },
              { key: 'resolved', label: '답변완료순' },
            ].map((sort) => (
              <button
                key={sort.key}
                type="button"
                onClick={() => setSortBy(sort.key as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  sortBy === sort.key
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="space-y-3">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white rounded-[24px] sm:rounded-[28px] p-12 text-center border border-black/[0.04] space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <div>
              <h4 className="text-sm font-bold text-slate-700">등록된 건의사항이 없습니다</h4>
              <p className="text-xs text-slate-400 mt-1">
                학교 생활에서 느꼈던 개선 아이디어를 실명으로 첫 건의해 보세요!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer active:scale-95 shadow-sm inline-flex items-center gap-1.5"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>새 건의사항 작성</span>
            </button>
          </div>
        ) : (
          filteredSuggestions.map((item) => {
            const isResolved = item.status === '답변완료';
            const isReviewing = item.status === '검토중';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedSuggestion(item)}
                className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-indigo-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Top Badges & Real-name chip */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : isReviewing
                            ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isResolved ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {item.status}
                      </span>

                      <span className="text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                        {item.category}
                      </span>
                    </div>

                    {/* Verified Author Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-[#F5F5F7] px-2 py-0.5 rounded-full border border-black/[0.03]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{item.authorName}</span>
                        <span className="text-slate-400 font-medium text-[11px]">
                          ({item.grade}학년 {item.classNum}반)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Preview Content */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* Official Reply Highlight Banner (If answered) */}
                  {item.reply && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/80 flex items-start gap-2 text-xs">
                      <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-900 text-[11px]">
                            {item.reply.author}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-medium">
                            {item.reply.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-950 font-medium truncate mt-0.5">
                          {item.reply.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card Footer: Date, Stats, Upvote button */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.03] text-xs text-slate-400">
                    <span className="text-[11px]">
                      {item.createdAt.slice(0, 10)}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.comments?.length || 0}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(item.id, !!item.likedByMe);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                          item.likedByMe
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${item.likedByMe ? 'fill-current' : ''}`} />
                        <span>{item.likeCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal: Create Suggestion */}
      <CreateSuggestionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentUser={currentUser}
        onSubmit={onCreateSuggestion}
      />

      {/* Modal: Suggestion Detail */}
      <SuggestionDetailModal
        suggestion={activeDetailSuggestion}
        onClose={() => setSelectedSuggestion(null)}
        currentUser={currentUser}
        onToggleLike={onToggleLike}
        onDelete={onDeleteSuggestion}
        onAddComment={onAddComment}
        onPostReply={onPostReply}
      />
    </div>
  );
}
