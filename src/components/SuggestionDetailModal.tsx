import { useState, type FormEvent } from 'react';
import {
  X,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  User,
  AlertCircle,
  Building,
  Image as ImageIcon,
  Edit3,
  Save,
  RotateCcw,
  Pin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SuggestionItem, UserProfile, SuggestionCategory, SuggestionStatus } from '../types';

interface SuggestionDetailModalProps {
  suggestion: SuggestionItem | null;
  onClose: () => void;
  currentUser: UserProfile;
  isAdmin?: boolean;
  onToggleLike: (id: string, currentlyLiked: boolean) => Promise<void>;
  onDelete: (id: string, pin: string) => Promise<{ success: boolean; message: string }>;
  onAddComment: (
    suggestionId: string,
    comment: { authorName: string; grade: number; classNum: number; content: string }
  ) => Promise<void>;
  onPostReply: (
    suggestionId: string,
    reply: { author: string; content: string; date: string },
    status: '검토중' | '답변완료'
  ) => Promise<void>;
  onAdminDelete?: (id: string) => Promise<boolean>;
  onAdminDeleteComment?: (suggestionId: string, commentId: string) => Promise<boolean>;
  onAdminUpdate?: (id: string, updates: Partial<SuggestionItem>) => Promise<boolean>;
}

export const OFFICIAL_DEPARTMENTS = [
  '학생생활안전부 (학생부)',
  '교무기획부 (교직원)',
  '제52대 총학생회',
  '진로진학상담부',
  '교육정보부',
  '행정실',
  '직접 입력',
] as const;

export default function SuggestionDetailModal({
  suggestion,
  onClose,
  currentUser,
  isAdmin = false,
  onToggleLike,
  onDelete,
  onAddComment,
  onPostReply,
  onAdminDelete,
  onAdminDeleteComment,
  onAdminUpdate,
}: SuggestionDetailModalProps) {
  const [commentName, setCommentName] = useState(
    currentUser.name === '서대전고 학생' ? '' : currentUser.name
  );
  const [commentGrade, setCommentGrade] = useState(currentUser.grade || 2);
  const [commentClass, setCommentClass] = useState(currentUser.classNum || 1);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Admin Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<Exclude<SuggestionCategory, '전체'>>('기타');
  const [editStatus, setEditStatus] = useState<SuggestionStatus>('접수대기');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isAdminDeleting, setIsAdminDeleting] = useState(false);

  // Delete modal state (Student PIN)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deletePin, setDeletePin] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Full-screen image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reply state (Only accessible when isAdmin is true)
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('학생생활안전부 (학생부)');
  const [customDepartment, setCustomDepartment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyStatus, setReplyStatus] = useState<'검토중' | '답변완료'>('답변완료');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleStartEdit = () => {
    if (!suggestion) return;
    setEditTitle(suggestion.title);
    setEditContent(suggestion.content);
    setEditCategory(suggestion.category);
    setEditStatus(suggestion.status);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!suggestion || !onAdminUpdate) return;
    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }
    setIsSavingEdit(true);
    try {
      const ok = await onAdminUpdate(suggestion.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        status: editStatus,
      });
      if (ok) {
        setIsEditing(false);
      } else {
        alert('수정 사항 저장에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleAdminDirectDelete = async () => {
    if (!suggestion || !onAdminDelete) return;
    const confirmed = window.confirm(
      `[관리자 즉시 삭제]\n\n정말로 "${suggestion.title}" 게시글을 삭제하시겠습니까?\n작성자 PIN 없이 즉시 영구 삭제됩니다.`
    );
    if (!confirmed) return;

    setIsAdminDeleting(true);
    try {
      const ok = await onAdminDelete(suggestion.id);
      if (ok) {
        onClose();
      } else {
        alert('삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsAdminDeleting(false);
    }
  };

  const handleAdminCommentDelete = async (commentId: string) => {
    if (!suggestion || !onAdminDeleteComment) return;
    const confirmed = window.confirm('관리자 권한으로 이 실명 댓글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await onAdminDeleteComment(suggestion.id, commentId);
    } catch (err) {
      console.error(err);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async () => {
    if (!suggestion) return;
    await onToggleLike(suggestion.id, !!suggestion.likedByMe);
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!suggestion) return;
    if (!commentName.trim() || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(suggestion.id, {
        authorName: commentName.trim(),
        grade: commentGrade,
        classNum: commentClass,
        content: commentText.trim(),
      });
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!suggestion) return;
    setDeleteError('');
    setIsDeleting(true);

    try {
      const res = await onDelete(suggestion.id, deletePin);
      if (res.success) {
        onClose();
      } else {
        setDeleteError(res.message);
      }
    } catch (err) {
      setDeleteError('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!suggestion || !isAdmin) return;
    if (!replyContent.trim()) return;

    const finalAuthor =
      selectedDepartment === '직접 입력'
        ? (customDepartment.trim() || '교무실 관리자')
        : selectedDepartment;

    setIsSubmittingReply(true);
    try {
      await onPostReply(
        suggestion.id,
        {
          author: finalAuthor,
          content: replyContent.trim(),
          date: new Date().toISOString().slice(0, 10),
        },
        replyStatus
      );
      setShowReplyForm(false);
      setReplyContent('');
      setCustomDepartment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '답변완료':
        return {
          label: '답변완료',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: CheckCircle2,
        };
      case '검토중':
        return {
          label: '검토중',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: Clock,
        };
      default:
        return {
          label: '접수대기',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
        };
    }
  };

  const statusBadge = suggestion ? getStatusBadge(suggestion.status) : null;
  const StatusIcon = statusBadge?.icon || Clock;

  return (
    <AnimatePresence>
      {suggestion && statusBadge && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Dialog Sheet / Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative bg-white rounded-t-[28px] sm:rounded-[28px] max-w-2xl w-full max-h-[92vh] shadow-2xl border border-black/[0.06] overflow-hidden flex flex-col pb-safe z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile handle indicator */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

            {/* Modal Top Nav Header */}
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-black/[0.04] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                {suggestion.isNotice && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-2xs shrink-0">
                    <Pin className="w-3 h-3 fill-current" />
                    공지사항
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${statusBadge.bg}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusBadge.label}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                  {suggestion.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={isEditing ? handleCancelEdit : handleStartEdit}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isEditing
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? '수정 취소' : '수정'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAdminDirectDelete}
                      disabled={isAdminDeleting}
                      title="관리자 권한 즉시 삭제 (PIN 번호 불필요)"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAdminDeleting ? '삭제 중...' : '관리자 삭제'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDeletePin('');
                      setDeleteError('');
                      setShowDeletePrompt(true);
                    }}
                    title="건의사항 삭제"
                    className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {isEditing ? (
                /* Admin Inline Edit Form */
                <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-indigo-600" />
                      관리자 권한 게시글 수정
                    </span>
                    <span className="text-[11px] text-slate-400">
                      작성자: {suggestion.authorName} ({suggestion.grade}학년 {suggestion.classNum}반)
                    </span>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      게시글 제목 <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold text-slate-900"
                      placeholder="제목을 입력하세요"
                    />
                  </div>

                  {/* Category & Status Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        분류 카테고리 <span className="text-indigo-600">*</span>
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                      >
                        {['급식', '시설/환경', '학사/수업', '학생자치/동아리', '기타'].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        처리 진행 상태 <span className="text-indigo-600">*</span>
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as SuggestionStatus)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                      >
                        <option value="접수대기">접수대기</option>
                        <option value="검토중">검토중</option>
                        <option value="답변완료">답변완료</option>
                      </select>
                    </div>
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      게시글 본문 내용 <span className="text-indigo-600">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                      placeholder="본문 내용을 입력하세요"
                    />
                  </div>

                  {/* Edit Form Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-100">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSavingEdit}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={isSavingEdit}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingEdit ? '저장 중...' : '수정사항 저장'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Main Title & Real-Name Author Info */}
                  <div className="space-y-3">
                    <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                      {suggestion.title}
                    </h2>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/[0.04] text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-[#F5F5F7] px-2.5 py-1 rounded-full border border-black/[0.03]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{suggestion.authorName}</span>
                          <span className="text-slate-400 font-normal">
                            ({suggestion.grade}학년 {suggestion.classNum}반
                            {suggestion.studentNumber ? ` ${suggestion.studentNumber}번` : ''})
                          </span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                          실명 인증
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {suggestion.createdAt.slice(0, 10)}
                        </span>
                        {suggestion.viewCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            조회 {suggestion.viewCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="bg-[#F5F5F7] p-4 sm:p-5 rounded-2xl border border-black/[0.03]">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                      {suggestion.content}
                    </p>

                    {/* Attached Images Gallery */}
                    {((suggestion.images && suggestion.images.length > 0) || suggestion.imageUrl) && (
                      <div className="mt-4 pt-4 border-t border-black/[0.04] space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>첨부 사진 (클릭 시 확대)</span>
                        </div>
                        <div
                          className={`grid gap-2.5 ${
                            (suggestion.images?.length || 1) === 1
                              ? 'grid-cols-1 max-w-sm'
                              : 'grid-cols-2 sm:grid-cols-3'
                          }`}
                        >
                          {(suggestion.images || (suggestion.imageUrl ? [suggestion.imageUrl] : [])).map((img, idx) => (
                            <div
                              key={idx}
                              onClick={() => setPreviewImage(img)}
                              className="relative aspect-4/3 rounded-xl overflow-hidden border border-black/[0.08] shadow-2xs hover:border-indigo-400 group cursor-pointer bg-slate-100"
                            >
                              <img
                                src={img}
                                alt={`첨부 사진 ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] font-bold bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs transition shadow-xs flex items-center gap-1">
                                  🔍 크게 보기
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Like/Agree button */}
                    <div className="mt-5 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        이 게시글에 공감하신다면 추천해 주세요.
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 1.15 }}
                        onClick={handleLike}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                          suggestion.likedByMe
                            ? 'bg-rose-500 text-white'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-black/[0.06]'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${suggestion.likedByMe ? 'fill-current' : ''}`} />
                        <span>공감 {suggestion.likeCount}</span>
                      </motion.button>
                    </div>
                  </div>
                </>
              )}

          {/* Official Reply Card (If any) */}
          {suggestion.reply ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-indigo-950">
                      공식 처리 답변
                    </h4>
                    <span className="text-[10px] text-indigo-600 font-semibold block">
                      {suggestion.reply.author}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-indigo-400 font-medium">
                    {suggestion.reply.date}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition cursor-pointer"
                    >
                      {showReplyForm ? '닫기' : '답변 수정'}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium pl-9">
                {suggestion.reply.content}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">
                  아직 공식 답변이 등록되지 않았습니다
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {isAdmin
                    ? '관리자 모드: 교직원, 학생부 등 공식 부서 자격으로 답변을 작성할 수 있습니다.'
                    : '담당 부서 및 학생회에서 건의 내용을 검토하고 있습니다.'}
                </span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer shadow-xs shrink-0"
                >
                  {showReplyForm ? '작성 닫기' : '공식 답변 작성하기'}
                </button>
              )}
            </div>
          )}

          {/* Admin Official Reply Form (Only visible to admin) */}
          {isAdmin && showReplyForm && (
            <form onSubmit={handleReplySubmit} className="p-4 sm:p-5 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-indigo-100/80 pb-2.5">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  관리자 전용 공식 답변 작성 (학생부 / 교직원 / 학생회)
                </span>
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  취소
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    공식 답변 주체 (직급 / 부서 선택) <span className="text-indigo-600">*</span>
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  >
                    {OFFICIAL_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  {selectedDepartment === '직접 입력' && (
                    <input
                      type="text"
                      required
                      placeholder="부서 또는 직급명 입력 (예: 학생생활안전부장)"
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 text-xs bg-white rounded-xl border border-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    처리 상태 변경 <span className="text-indigo-600">*</span>
                  </label>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value as '검토중' | '답변완료')}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  >
                    <option value="답변완료">답변완료 (해결 및 조치 결과 공식 안내)</option>
                    <option value="검토중">검토중 (대의원회 및 교무부 검토 진행 중)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  공식 답변 내용 <span className="text-indigo-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="건의사항에 대한 학교 및 학생부의 공식 검토 결과, 조치 계획, 개선 사항을 정중하게 작성해 주세요."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? '등록 중...' : '공식 답변 등록'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Real-Name Comments Section */}
          <div className="space-y-4 pt-2 border-t border-black/[0.04]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>실명 의견 및 동의 댓글 ({suggestion.comments?.length || 0})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                실명제 댓글 공간
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-2.5">
              {suggestion.comments && suggestion.comments.length > 0 ? (
                suggestion.comments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{cmt.authorName}</span>
                        <span className="text-slate-400 font-medium">
                          ({cmt.grade}학년 {cmt.classNum}반)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {cmt.createdAt.slice(0, 10)}
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleAdminCommentDelete(cmt.id)}
                            title="관리자 댓글 삭제"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed pl-4">
                      {cmt.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 bg-[#F5F5F7] rounded-2xl">
                  아직 등록된 의견이 없습니다. 첫 번째 동의 댓글을 남겨보세요!
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="작성자 실명"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-28 px-2.5 py-1.5 text-xs bg-[#F5F5F7] rounded-xl border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
                <select
                  value={commentGrade}
                  onChange={(e) => setCommentGrade(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs bg-[#F5F5F7] rounded-xl border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value={1}>1학년</option>
                  <option value={2}>2학년</option>
                  <option value={3}>3학년</option>
                </select>
                <select
                  value={commentClass}
                  onChange={(e) => setCommentClass(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs bg-[#F5F5F7] rounded-xl border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                    <option key={c} value={c}>
                      {c}반
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="게시글에 대한 의견을 실명으로 작성해 주세요"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-[#F5F5F7] rounded-xl border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-slate-800 transition cursor-pointer shrink-0 disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Delete Prompt Dialog Sub-modal */}
        {showDeletePrompt && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl border border-black/[0.06] space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">게시글 삭제 확인</h4>
                  <p className="text-xs text-slate-400">
                    작성 시 등록한 4자리 비밀번호를 입력해 주세요.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {deleteError}
                </div>
              )}

              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="PIN 4자리"
                value={deletePin}
                onChange={(e) => setDeletePin(e.target.value)}
                className="w-full text-center tracking-widest text-base font-mono py-2.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-rose-400 focus:bg-white focus:outline-none font-bold"
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeletePrompt(false);
                    setDeleteError('');
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isDeleting || deletePin.length < 4}
                  className="px-4 py-2 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )}

  {/* Full-screen Lightbox Image Modal */}
  {previewImage && (
    <div
      className="fixed inset-0 z-70 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
      onClick={() => setPreviewImage(null)}
    >
      <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setPreviewImage(null)}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
          title="닫기"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={previewImage}
          alt="확대 이미지"
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10 cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )}
</AnimatePresence>
  );
}
