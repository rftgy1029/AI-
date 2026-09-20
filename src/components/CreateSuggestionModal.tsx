import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
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
  Image as ImageIcon,
  Plus,
  Pin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SuggestionItem, SuggestionCategory } from '../types';

interface CreateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isAdmin?: boolean;
  initialNotice?: boolean;
  onSubmit: (data: Omit<SuggestionItem, 'id'>) => Promise<void>;
}

// Client-side image compression for instant, lightweight cloud sync
async function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('이미지 로딩에 실패했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다.'));
    reader.readAsDataURL(file);
  });
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
  isAdmin = false,
  initialNotice = false,
  onSubmit,
}: CreateSuggestionModalProps) {
  const [isNotice, setIsNotice] = useState(initialNotice);
  const [authorName, setAuthorName] = useState(
    initialNotice
      ? '학생생활안전부 (관리자)'
      : currentUser.name === '서대전고 학생'
      ? ''
      : currentUser.name
  );
  const [grade, setGrade] = useState<number>(currentUser.grade || 2);
  const [classNum, setClassNum] = useState<number>(currentUser.classNum || 1);
  const [studentNumber, setStudentNumber] = useState<string>(
    currentUser.studentNumber ? String(currentUser.studentNumber) : ''
  );
  const [category, setCategory] = useState<Exclude<SuggestionCategory, '전체'>>('급식');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pin, setPin] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize modal state with latest currentUser and notice state whenever opened
  useEffect(() => {
    if (isOpen) {
      if (!isNotice) {
        setAuthorName(currentUser.name === '서대전고 학생' ? '' : currentUser.name);
      }
      setGrade(currentUser.grade || 2);
      setClassNum(currentUser.classNum || 1);
      setStudentNumber(currentUser.studentNumber ? String(currentUser.studentNumber) : '');
      setErrorMsg('');
      setIsSuccess(false);
    }
  }, [isOpen, currentUser, isNotice]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      setErrorMsg('사진은 최대 3장까지 첨부할 수 있습니다.');
      return;
    }

    setIsProcessingImages(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        compressedList.push(compressed);
      }
      setImages((prev) => [...prev, ...compressedList].slice(0, 3));
    } catch (err) {
      console.error(err);
      setErrorMsg('이미지 처리 중 문제가 발생했습니다.');
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (!isAdmin && pin.length < 4) {
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
        status: isNotice ? '답변완료' : '접수대기',
        likeCount: 0,
        likedByMe: false,
        passwordHash: pin || '0000',
        createdAt: new Date().toISOString(),
        viewCount: 1,
        comments: [],
        images: images.length > 0 ? images : undefined,
        imageUrl: images[0] || undefined,
        isNotice,
      });

      // Show success feedback
      setIsSubmitting(false);
      setIsSuccess(true);

      // Automatically close modal after brief confirmation
      setTimeout(() => {
        setTitle('');
        setContent('');
        setPin('');
        setImages([]);
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
    <AnimatePresence>
      {isOpen && (
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
            className="relative bg-white rounded-t-[28px] sm:rounded-[28px] max-w-xl w-full max-h-[92vh] shadow-2xl border border-black/[0.06] overflow-hidden flex flex-col pb-safe z-10"
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
          {/* Admin Notice Banner Toggle */}
          {isAdmin && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Pin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    학교/학생회 공식 공지사항 등록
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium block">
                    게시판 최상단에 고정되며 [공지사항] 배지가 표시됩니다.
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isNotice}
                  onChange={(e) => {
                    setIsNotice(e.target.checked);
                    if (e.target.checked && (!authorName || authorName === '서대전고 학생')) {
                      setAuthorName('학생생활안전부 (관리자)');
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          )}

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
              rows={6}
              maxLength={2000}
              placeholder={`[서대전고 클린 디지털 소통 약속]
💬 "화면 너머에도 나와 같은 소중한 학우와 선생님이 있습니다."

1. 감정적인 비난이나 특정인 저격 대신, 문제 상황 자체에 집중해 주세요.
2. 단순 불평을 넘어 '함께 바꿀 수 있는 구체적인 대안'을 정중하게 제안해 주세요.
3. 우리 모두가 자부심을 가질 수 있는 건강하고 따뜻한 언어를 사용해 주세요.`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F5F5F7] rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition leading-relaxed resize-none placeholder:text-slate-400/90 placeholder:leading-relaxed"
            />
          </div>

          {/* Photo / Image attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>사진 첨부 (시설 파손, 급식 등 증빙 자료, 최대 3장)</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                {images.length}/3장
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image thumbnails and add button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-black/10 shadow-2xs group bg-slate-100 shrink-0"
                >
                  <img
                    src={imgSrc}
                    alt={`첨부 이미지 ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                    title="사진 삭제"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    {idx + 1}
                  </span>
                </div>
              ))}

              {images.length < 3 && (
                <button
                  type="button"
                  disabled={isProcessingImages}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-[#F5F5F7] hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-indigo-600 transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isProcessingImages ? (
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span className="text-[11px] font-bold">사진 추가</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 4-digit PIN password */}
          {!isAdmin ? (
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
          ) : (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">
                    관리자 자동 인증 (PIN 면제)
                  </span>
                  <span className="text-[10px] text-indigo-600 block">
                    관리자 권한으로 등록되며 언제든 비밀번호 없이 즉시 수정/삭제가 가능합니다
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0 shadow-2xs">
                Master Pass
              </span>
            </div>
          )}

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
      </motion.div>
    </div>
  )}
</AnimatePresence>
);
}
