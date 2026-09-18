import { useState, type FormEvent } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { UserProfile, SuggestionItem, SuggestionCategory } from '../types';

interface CreateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmit: (data: Omit<SuggestionItem, 'id'>) => Promise<void>;
}

const CATEGORIES: Exclude<SuggestionCategory, '전체'>[] = [
  '급식',
  '시설/환경',
  '학사/수업',
  '학생자치/동아리',
  '기타',
];

export default function CreateSuggestionModal({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}: CreateSuggestionModalProps) {
  const [authorName, setAuthorName] = useState(
    currentUser.name === '서대전고 학생' ? '' : currentUser.name
  );
  const [grade, setGrade] = useState<number>(currentUser.grade || 2);
  const [classNum, setClassNum] = useState<number>(currentUser.classNum || 3);
  const [studentNumber, setStudentNumber] = useState<string>(
    currentUser.studentNumber ? String(currentUser.studentNumber) : ''
  );
  const [category, setCategory] = useState<Exclude<SuggestionCategory, '전체'>>('급식');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;
    setErrorMsg('');

    if (!authorName.trim()) {
      setErrorMsg('실명제 운영 원칙에 따라 작성자의 실명을 정확히 입력해 주세요.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('건의사항 제목을 입력해 주세요.');
      return;
    }
    if (content.trim().length < 10) {
      setErrorMsg('구체적인 검토를 위해 건의 내용을 최소 10자 이상 작성해 주세요.');
      return;
    }
    if (pin.length < 4) {
      setErrorMsg('글 수정 및 삭제 시 사용할 4자리 비밀번호(PIN)를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        authorName: authorName.trim(),
        grade,
        classNum,
        studentNumber: studentNumber ? Number(studentNumber) : undefined,
        category,
        status: '접수대기',
        likeCount: 0,
        likedByMe: false,
        passwordHash: pin,
        createdAt: new Date().toISOString(),
        viewCount: 1,
        comments: [],
      });

      // Show success feedback
      setIsSubmitting(false);
      setIsSuccess(true);

      // Automatically close modal after brief confirmation
      setTimeout(() => {
        setTitle('');
        setContent('');
        setPin('');
        setIsSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMsg('건의사항 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-xl w-full max-h-[92vh] shadow-2xl border border-black/[0.06] overflow-hidden flex flex-col pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-black/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                학생 게시글 작성
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                서대전고등학교 학생 및 교직원 소통 게시판
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Real-name policy alert */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-indigo-900 block">
                실명제 운영 안내 (비방 및 허위 사실 방지)
              </span>
              <p className="text-[11px] text-indigo-700/90 font-medium">
                신뢰할 수 있는 소통 문화를 위해 작성자의 실제 이름과 학년/반이 공개 표기됩니다.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-bold animate-in fade-in zoom-in-95 duration-200 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-emerald-950 font-extrabold text-sm">등록이 완료되었습니다!</span>
                <span className="text-[11px] text-emerald-700 font-medium">창이 곧 자동으로 닫힙니다...</span>
              </div>
            </div>
          )}

          {/* Real-name identity inputs */}
          <div className="bg-[#F5F5F7] p-3.5 sm:p-4 rounded-2xl border border-black/[0.03] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>작성자 실명 정보</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  이름 (실명) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 김서전"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  소속 학년/반
                </label>
                <div className="flex items-center gap-1.5">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value={1}>1학년</option>
                    <option value={2}>2학년</option>
                    <option value={3}>3학년</option>
                  </select>
                  <select
                    value={classNum}
                    onChange={(e) => setClassNum(Number(e.target.value))}
                    className="w-1/2 px-2.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <option key={c} value={c}>
                        {c}반
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  학번 (선택)
                </label>
                <input
                  type="number"
                  placeholder="예: 14"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              건의 분야 <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    category === cat
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              건의 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="건의사항의 핵심 내용을 명확하게 작성해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F5F5F7] rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Content input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-600">
                건의 내용 <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {content.length}/2000자
              </span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={2000}
              placeholder="1. 현재 겪고 있는 문제점이나 건의 배경&#10;2. 학교나 학생회에 바라는 구체적인 개선안&#10;3. 기대 효과나 전교생에게 돌아가는 혜택 등을 정중하게 작성해 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F5F5F7] rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition leading-relaxed resize-none"
            />
          </div>

          {/* 4-digit PIN password */}
          <div className="p-3 bg-[#F5F5F7] rounded-xl border border-black/[0.03] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  비밀번호 (PIN 4자리)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  추후 본인 확인 및 건의글 삭제 시 필요합니다
                </span>
              </div>
            </div>
            <input
              type="password"
              required
              maxLength={4}
              pattern="[0-9]*"
              placeholder="1234"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-24 px-3 py-1.5 text-center text-xs tracking-widest bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-mono font-bold"
            />
          </div>

          {/* Footer CTA */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/[0.04]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isSuccess}
              className="px-5 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed ${
                isSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-75'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-in zoom-in-50 duration-200" />
                  <span>등록 완료!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>등록 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>게시글 등록</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
