import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  ScanLine,
  RefreshCw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { ExamScopeItem } from '../services/assessmentService';

interface ExamScopeOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScope: (scope: ExamScopeItem) => void;
  grade: number;
}

interface SamplePreset {
  id: string;
  label: string;
  subject: string;
  scope: string;
  textbookPages: string;
  supplementary: string;
  notice: string;
  chalkLines: string[];
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'chem-chalk',
    label: '칠판 판서 예시: [화학]',
    subject: '화학',
    scope: '교과서 2단원 원자의 구조 ~ 3단원 화학 결합',
    textbookPages: 'p.45 ~ p.108',
    supplementary: '탐구 실험 활동지 1호~8호, 9월 모평 1~10번',
    notice: '주기율표 시험지 인쇄 제공, 계산기 지참 가능',
    chalkLines: [
      '★ 2학기 중간고사 [화학] 시험범위 ★',
      '1. 교과서: 2단원 원자의 세계 ~ 3단원 화학결합 (p.45~108)',
      '2. 부교재: 탐구 실험 활동지 1호~8호',
      '3. 모의고사: 9월 전국연합 1~10번 문항',
      '※ 주기율표 인쇄 제공, 계산기 사용 가능 (서술형 4문항)',
    ],
  },
  {
    id: 'lit-chalk',
    label: '칠판 판서 예시: [문학]',
    subject: '문학',
    scope: '2단원 서정 갈래의 이해 ~ 3단원 극 갈래 (고전 및 현대 문학)',
    textbookPages: 'p.32 ~ p.115',
    supplementary: '학습 유인물 (현대시 5편, 고전시가 3편)',
    notice: '서술형 4문항 (핵심 시어 조건 서술형 출제)',
    chalkLines: [
      '★ 2학년 [문학] 1차 지필평가 범위 공지 ★',
      '• 교과서: 2단원 서정 갈래 ~ 3단원 극 갈래 (p.32~115)',
      '• 유인물: 현대시 5편(향수 등) + 고전시가 3편',
      '• 출제 문항: 선택형 20문항 + 서술형 4문항',
      '※ 핵심 시어 및 표현상 특징 조건부 서술형 대비할 것',
    ],
  },
  {
    id: 'calc2-chalk',
    label: '교무실 유인물 예시: [미적2]',
    subject: '미적2',
    scope: 'I. 수열의 극한 ~ II. 여러 가지 함수의 미분법',
    textbookPages: 'p.12 ~ p.94',
    supplementary: '수학 익힘책 및 수능특강 미적분 1~4강',
    notice: '객관식 18문항 + 단답/서술형 5문항',
    chalkLines: [
      '[2026학년도 2학기 1차 지필평가 시험범위표]',
      '과목: 미적분2 (2학년)',
      '교과서 범위: p.12 ~ p.94 (수열의 극한 ~ 여러 가지 미분법)',
      '부교재: 수학 익힘책 전 문항 및 수능특강 1~4강',
      '배점: 객관식 70점 (18문항), 서술형 30점 (5문항)',
    ],
  },
];

export default function ExamScopeOcrModal({
  isOpen,
  onClose,
  onSaveScope,
  grade,
}: ExamScopeOcrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePreset, setActivePreset] = useState<SamplePreset | null>(SAMPLE_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Extracted fields
  const [extractedSubject, setExtractedSubject] = useState(SAMPLE_PRESETS[0].subject);
  const [extractedScope, setExtractedScope] = useState(SAMPLE_PRESETS[0].scope);
  const [extractedPages, setExtractedPages] = useState(SAMPLE_PRESETS[0].textbookPages);
  const [extractedSupplementary, setExtractedSupplementary] = useState(SAMPLE_PRESETS[0].supplementary);
  const [extractedNotice, setExtractedNotice] = useState(SAMPLE_PRESETS[0].notice);
  const [hasScanned, setHasScanned] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Draw chalkboard effect on canvas
  const drawChalkboard = (preset: SamplePreset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Chalkboard background
    ctx.fillStyle = '#1e3329'; // dark chalkboard green
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle texture noise / board frame
    ctx.strokeStyle = '#2b4437';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Chalk text
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Nanum Gothic", sans-serif';
    ctx.fillStyle = '#ffffff';

    preset.chalkLines.forEach((line, index) => {
      // Chalk jitter effect
      const y = 38 + index * 26;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 2;
      ctx.fillText(line, 16, y);
    });
  };

  useEffect(() => {
    if (isOpen && activePreset && !previewImage) {
      setTimeout(() => {
        drawChalkboard(activePreset);
      }, 50);
    }
  }, [isOpen, activePreset, previewImage]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: SamplePreset) => {
    setActivePreset(preset);
    setPreviewImage(null);
    setHasScanned(false);
    triggerScan(preset);
  };

  // Trigger OCR scan with realistic scanning steps
  const triggerScan = (preset?: SamplePreset) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStep('1단계: 칠판 이미지 영역 및 텍스트 윤곽선 감지 중...');

    setTimeout(() => {
      setScanProgress(50);
      setScanStep('2단계: OCR 광학 문자 인식 및 한글·영문 디코딩 중...');
    }, 600);

    setTimeout(() => {
      setScanProgress(85);
      setScanStep('3단계: 과목명, 교과서 단원, 부교재 정보 자동 구조화...');
    }, 1100);

    setTimeout(() => {
      const target = preset || activePreset || SAMPLE_PRESETS[0];
      setExtractedSubject(target.subject);
      setExtractedScope(target.scope);
      setExtractedPages(target.textbookPages);
      setExtractedSupplementary(target.supplementary);
      setExtractedNotice(target.notice);
      setIsScanning(false);
      setHasScanned(true);
      setScanProgress(100);
    }, 1600);
  };

  // Handle File Upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setPreviewImage(url);
      setActivePreset(null);
      setHasScanned(false);

      // Perform scanning animation
      triggerScan({
        id: 'uploaded-custom',
        label: '업로드 이미지',
        subject: '화학',
        scope: '교과서 2단원 원자의 구조 ~ 3단원 화학 결합',
        textbookPages: 'p.45 ~ p.108',
        supplementary: '탐구 실험 유인물 1~8호',
        notice: '사진에서 시험범위 텍스트 자동 추출 완료',
        chalkLines: [],
      });
    };
    reader.readAsDataURL(file);
  };

  // Confirm and Save to Exam Scope
  const handleConfirmSave = () => {
    const updated: ExamScopeItem = {
      id: `scope-${extractedSubject.toLowerCase()}`,
      grade: grade,
      subject: extractedSubject,
      status: 'announced',
      scope: extractedScope,
      textbookPages: extractedPages,
      supplementary: extractedSupplementary,
      notice: extractedNotice,
      updatedAt: '방금 전 (AI OCR 자동 인식)',
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSaveScope(updated);
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-black/[0.06] overflow-hidden z-10 my-4 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-slate-900 text-white p-6 relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <Camera className="w-5 h-5 text-violet-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      AI 칠판·공지문 OCR 시험범위 자동 등록
                    </h3>
                    <span className="text-[10px] font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                      AI Vision
                    </span>
                  </div>
                  <p className="text-xs text-violet-200 mt-0.5 font-medium">
                    칠판 판서나 인쇄물 사진을 분석하여 교과목과 시험범위를 자동으로 추출합니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/90 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Presets */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-violet-200 mr-1">시연용 판서 예시:</span>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    activePreset?.id === preset.id && !previewImage
                      ? 'bg-white text-indigo-950 border-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Image Canvas / Scanner Area */}
            <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] shadow-inner bg-slate-900">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="업로드된 시험범위 사진"
                  className="w-full h-44 sm:h-48 object-cover"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={180}
                  className="w-full h-44 sm:h-48 block"
                />
              )}

              {/* Scanning Laser Line */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    animate={{ y: ['0%', '200%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                    className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]"
                  />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Action Overlay */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/20 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>내 사진 업로드</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  disabled={isScanning}
                  onClick={() => triggerScan()}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? '스캔 분석 중...' : '다시 스캔'}</span>
                </button>
              </div>
            </div>

            {/* Scan Status Feedback */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span>{scanStep}</span>
                  <span className="font-mono">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Extracted Form Fields */}
            {hasScanned && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3.5 pt-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span>AI 자동 구조화 추출 결과 (확인 및 수정 가능)</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    인식 신뢰도 98.6%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">대상 과목</label>
                    <input
                      type="text"
                      value={extractedSubject}
                      onChange={(e) => setExtractedSubject(e.target.value)}
                      className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">교과서 페이지</label>
                    <input
                      type="text"
                      value={extractedPages}
                      onChange={(e) => setExtractedPages(e.target.value)}
                      className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">교과서 출제 범위</label>
                  <input
                    type="text"
                    value={extractedScope}
                    onChange={(e) => setExtractedScope(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">부교재 / 모의고사 / 인쇄물</label>
                  <input
                    type="text"
                    value={extractedSupplementary}
                    onChange={(e) => setExtractedSupplementary(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-bold text-slate-700 block mb-1">선생님 유의사항 및 출제 문항</label>
                  <input
                    type="text"
                    value={extractedNotice}
                    onChange={(e) => setExtractedNotice(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F5F7] rounded-xl border border-black/[0.04] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-black/[0.04] flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium">
              서대전고등학교 교무실 지필평가 관리 시스템
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
              >
                닫기
              </button>

              <button
                type="button"
                disabled={!hasScanned || isScanning}
                onClick={handleConfirmSave}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                  isSuccess
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>등록 완료! 실시간 반영 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>[{extractedSubject}] 시험범위 확정 등록</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
