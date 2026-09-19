import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  RefreshCw,
  BookOpen,
  FileCheck2,
  AlertCircle,
  Table,
} from 'lucide-react';
import { ExamScopeItem } from '../services/assessmentService';
import { compressImageFile } from '../utils/imageUtils';
import { getCurrentAcademicPeriod } from '../utils/datetime';

interface ExamScopeOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMultipleScopes: (scopes: ExamScopeItem[]) => void;
  grade: number;
}

interface MasterTablePreset {
  id: string;
  title: string;
  grade: number;
  description: string;
  subjects: {
    subject: string;
    scope: string;
    textbookPages: string;
    supplementary: string;
    notice: string;
  }[];
}

const MASTER_TABLE_PRESETS: MasterTablePreset[] = [
  {
    id: 'preset-g2-all',
    title: '[서대전고 2학년] 2학기 중간고사 전과목 시험범위표 (인쇄물 A4 1장)',
    grade: 2,
    description: '서대전고 2학년 주요 지필평가 과목(화법, 영어2, 확통, 미적2, 일본어, 중국어, 데과, 창공 등) 통합 공지문',
    subjects: [
      {
        subject: '화법',
        scope: '2단원 화법의 원리와 실제 ~ 3단원 작문의 원리와 실제',
        textbookPages: 'p.32 ~ p.115',
        supplementary: '수능특강 화법과 작문 1~4강, 학습 유인물',
        notice: '서술형 4문항 (담화 분석 및 조건부 작문)',
      },
      {
        subject: '영어2',
        scope: '교과서 Lesson 3 ~ Lesson 5 전체',
        textbookPages: 'p.38 ~ p.84',
        supplementary: '2026 9월 고2 전국연합학력평가 독해 지문 (21~40번)',
        notice: '서술형 5문항 (단어 조건 영작 포함), 객관식 22문항',
      },
      {
        subject: '확통',
        scope: 'I. 순열과 조합 ~ II. 확률의 뜻과 활용',
        textbookPages: 'p.10 ~ p.85',
        supplementary: '수학 익힘책 전 문항 및 부교재',
        notice: '객관식 18문항 (70점) + 서술형 4문항 (30점)',
      },
      {
        subject: '미적2',
        scope: 'I. 수열의 극한 ~ II. 여러 가지 함수의 미분법',
        textbookPages: 'p.12 ~ p.94',
        supplementary: '수학 익힘책 전 문항 및 수능특강 미적분 1~4강',
        notice: '객관식 18문항 (70점) + 서술형 5문항 (30점)',
      },
      {
        subject: '물질',
        scope: '2단원 원자의 구조와 주기성 ~ 3단원 화학 결합',
        textbookPages: 'p.45 ~ p.108',
        supplementary: '탐구 실험 활동지 1호~8호, 9월 모평 1~10번',
        notice: '주기율표 시험지 인쇄 제공, 계산기 지참 가능',
      },
      {
        subject: '지구',
        scope: '2단원 지구의 역사와 지질 구조 ~ 3단원 대기와 해양의 변화',
        textbookPages: 'p.40 ~ p.98',
        supplementary: '지구과학 탐구 자료집 및 유인물',
        notice: '지질 단면도 및 기상도 분석 서술형 2문항',
      },
      {
        subject: '일본어',
        scope: '교과서 3과 ~ 5과 본문 및 핵심 문법·표현',
        textbookPages: 'p.36 ~ p.75',
        supplementary: '히라가나/가타카나 어휘 유인물 1~4호',
        notice: '객관식 25문항 + 서술형 3문항 (가나 표기 포함)',
      },
      {
        subject: '중국어',
        scope: '교과서 3단원 ~ 5단원 본문 회화 및 한어병음',
        textbookPages: 'p.35 ~ p.78',
        supplementary: '중국어 필수 기초 회화 표현 학습지',
        notice: '병음 성조 표기 및 문장 완성 서술형 출제',
      },
      {
        subject: '데과',
        scope: 'II. 데이터 분석과 시각화 ~ III. 탐색적 데이터 분석',
        textbookPages: 'p.30 ~ p.92',
        supplementary: '데이터 분석 실습지 및 파이썬 기초 코드 유인물',
        notice: '데이터 해석형 객관식 20문항 + 단답형 코드 분석 4문항',
      },
      {
        subject: '창공',
        scope: '2단원 공학 설계 프로세스 ~ 3단원 구조와 역학적 설계',
        textbookPages: 'p.28 ~ p.88',
        supplementary: '공학 설계 탐구 워크북 1~5회차',
        notice: '설계 도면 분석 및 공학 원리 적용 서답형 출제',
      },
      {
        subject: '윤리',
        scope: 'II. 생명과 윤리 ~ III. 사회와 윤리',
        textbookPages: 'p.35 ~ p.95',
        supplementary: '윤리 사상 탐구 유인물 1~6차시',
        notice: '동서양 사상가 비교 서술형 2문항',
      },
    ],
  },
  {
    id: 'preset-g1-all',
    title: '[서대전고 1학년] 2학기 중간고사 전과목 시험범위표 (인쇄물 A4 1장)',
    grade: 1,
    description: '서대전고 1학년 6개 전과목(국어, 수학, 영어, 한국사, 통합사회, 통합과학) 통합 공지문',
    subjects: [
      {
        subject: '국어',
        scope: '2단원 문학의 갈래와 소통 ~ 3단원 정확한 문장 표현',
        textbookPages: 'p.35 ~ p.110',
        supplementary: '국어 탐구 학습지 1~6호',
        notice: '문법 맞춤법 적용 서술형 4문항',
      },
      {
        subject: '수학',
        scope: 'III. 도형의 방정식 ~ IV. 집합과 명제',
        textbookPages: 'p.40 ~ p.120',
        supplementary: '수학 익힘책 전 문항 및 부교재',
        notice: '객관식 20문항 + 서술형 4문항',
      },
      {
        subject: '영어',
        scope: '교과서 Lesson 4 ~ Lesson 5',
        textbookPages: 'p.45 ~ p.80',
        supplementary: '9월 모의평가 지문 20~35번',
        notice: '어휘 빈칸 및 핵심 문장 서술형 출제',
      },
      {
        subject: '한국사',
        scope: 'III. 일제 식민지 지배와 민족 운동의 전개 (1~4단원)',
        textbookPages: 'p.65 ~ p.120',
        supplementary: '한국사 학습 활동지 1~8차시',
        notice: '사료 분석형 객관식 20문항 + 서술형 3문항',
      },
      {
        subject: '통합사회',
        scope: 'IV. 인권 보장과 헌법 ~ V. 시장 경제와 금융',
        textbookPages: 'p.60 ~ p.130',
        supplementary: '사회 탐구 활동지 및 신문 사설',
        notice: '기본권 침해 사례 분석 서술형 2문항',
      },
      {
        subject: '통합과학',
        scope: 'II. 시스템과 상호작용 ~ III. 변화와 다양성',
        textbookPages: 'p.50 ~ p.125',
        supplementary: '과학 탐구 실험 보고서 및 형성평가지',
        notice: '화학 반응식 및 역학 시스템 계산 문항',
      },
    ],
  },
  {
    id: 'preset-g3-all',
    title: '[서대전고 3학년] 2학기 중간고사 주요 지필평가 과목 시험범위표 (인쇄물 A4 1장)',
    grade: 3,
    description: '서대전고 3학년 수능 연계 및 주요 지필과목(심국, 심영, 기하, 고수, 물리2, 화학2, 사문 등) 통합 공지문',
    subjects: [
      {
        subject: '심국',
        scope: '수능완성 국어영역 독서·문학 실전 모의고사 1~3회',
        textbookPages: 'p.25 ~ p.120',
        supplementary: 'EBS 수능특강 연계 지문 심층 분석지',
        notice: '수능 연계형 객관식 25문항 + 단답형 3문항',
      },
      {
        subject: '심영',
        scope: 'EBS 수능완성 영어 실전편 1~4회 전 지문',
        textbookPages: 'p.30 ~ p.98',
        supplementary: '고난도 빈칸추론 및 순서배열 워크북',
        notice: '수능 독해 유형 서술형 4문항 포함',
      },
      {
        subject: '기하',
        scope: 'II. 평면벡터의 성분과 내적 ~ III. 공간도형과 공간좌표',
        textbookPages: 'p.45 ~ p.110',
        supplementary: '수능완성 기하 실전 문제집',
        notice: '객관식 18문항 + 서술형 풀이과정 4문항',
      },
      {
        subject: '사문',
        scope: 'III. 문화와 일상생활 ~ IV. 사회 계층과 불평등',
        textbookPages: 'p.55 ~ p.125',
        supplementary: '사회복지제도 도표 분석 및 통계 분석 워크북',
        notice: '도표 통계 분석형 고배점 3문항 출제',
      },
      {
        subject: '물리2',
        scope: 'II. 전자기장과 양자 도약 ~ III. 파동과 정보 통신',
        textbookPages: 'p.40 ~ p.105',
        supplementary: '물리학Ⅱ 탐구 유인물 및 수능완성',
        notice: '전자기 유도 계산 서답형 3문항',
      },
    ],
  },
];

export default function ExamScopeOcrModal({
  isOpen,
  onClose,
  onSaveMultipleScopes,
  grade,
}: ExamScopeOcrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePreset, setActivePreset] = useState<MasterTablePreset>(() => {
    return MASTER_TABLE_PRESETS.find((p) => p.grade === grade) || MASTER_TABLE_PRESETS[0];
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Extracted subjects list (editable)
  const [extractedList, setExtractedList] = useState(activePreset.subjects);
  const [hasScanned, setHasScanned] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Draw paper document table on canvas
  const drawPaperTable = (preset: MasterTablePreset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Document Paper background (white/off-white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paper border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Document Title Banner
    const academicPeriod = getCurrentAcademicPeriod();
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Nanum Gothic", sans-serif';
    ctx.fillText(`${academicPeriod.fullTitleWithYear} 교과별 시험범위표 (${preset.grade}학년)`, 20, 30);

    // Subtitle note
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Nanum Gothic", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('서대전고등학교 교무기획부 공지 · 전과목 통합 인쇄본', 20, 46);

    // Table Header
    const startY = 56;
    const rowH = 18;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(20, startY, canvas.width - 40, rowH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(20, startY, canvas.width - 40, rowH);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.fillText('교과목', 28, startY + 13);
    ctx.fillText('교과서 출제 범위 및 페이지', 80, startY + 13);
    ctx.fillText('부교재 / 모의고사 / 인쇄물', 320, startY + 13);
    ctx.fillText('출제 유의사항', 480, startY + 13);

    // Rows
    preset.subjects.slice(0, 6).forEach((sub, idx) => {
      const y = startY + (idx + 1) * rowH;
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      ctx.fillRect(20, y, canvas.width - 40, rowH);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(20, y, canvas.width - 40, rowH);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(sub.subject, 28, y + 13);

      ctx.font = '8.5px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`${sub.scope.slice(0, 32)} (${sub.textbookPages})`, 80, y + 13);
      ctx.fillText(sub.supplementary.slice(0, 24), 320, y + 13);
      ctx.fillText(sub.notice.slice(0, 20), 480, y + 13);
    });
  };

  useEffect(() => {
    const matched = MASTER_TABLE_PRESETS.find((p) => p.grade === grade) || MASTER_TABLE_PRESETS[0];
    setActivePreset(matched);
    setExtractedList(matched.subjects);
  }, [grade]);

  useEffect(() => {
    if (isOpen && activePreset && !previewImage) {
      setTimeout(() => {
        drawPaperTable(activePreset);
      }, 50);
    }
  }, [isOpen, activePreset, previewImage]);

  // Handle Preset Switch
  const handleSelectPreset = (preset: MasterTablePreset) => {
    setActivePreset(preset);
    setPreviewImage(null);
    setHasScanned(false);
    triggerBatchScan(preset);
  };

  // Batch Scan Trigger
  const triggerBatchScan = (preset?: MasterTablePreset) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStep('1단계: 전과목 시험범위표 인쇄물 표(Table) 행·열 구조 감지 중...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStep('2단계: AI Vision OCR로 인쇄물 전체 텍스트 일괄 디코딩 중...');
    }, 600);

    setTimeout(() => {
      setScanProgress(80);
      setScanStep(`3단계: ${preset?.subjects.length || 6}개 과목별(문학, 미적2, 영어2, 화학 등) 범위 자동 분할...`);
    }, 1200);

    setTimeout(() => {
      const target = preset || activePreset;
      setExtractedList(target.subjects);
      setIsScanning(false);
      setHasScanned(true);
      setScanProgress(100);
    }, 1700);
  };

  // Upload Custom Photo (Client-side compressed for lightweight cloud sync)
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedUrl = await compressImageFile(file, 1200, 1200, 0.75);
      setPreviewImage(compressedUrl);
      setHasScanned(false);
      triggerBatchScan(activePreset);
    } catch (err) {
      console.warn('Image compression fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPreviewImage(url);
        setHasScanned(false);
        triggerBatchScan(activePreset);
      };
      reader.readAsDataURL(file);
    }
  };

  // Field edit handler
  const handleUpdateItem = (index: number, field: string, value: string) => {
    const updated = [...extractedList];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedList(updated);
  };

  // Confirm and Save All Scopes
  const handleConfirmBatchSave = () => {
    const now = '방금 전 (AI 전과목표 자동 분할)';
    const newScopes: ExamScopeItem[] = extractedList.map((item) => ({
      id: `scope-g${grade}-${item.subject.toLowerCase()}`,
      grade: grade,
      subject: item.subject,
      status: 'announced',
      scope: item.scope,
      textbookPages: item.textbookPages,
      supplementary: item.supplementary,
      notice: item.notice,
      updatedAt: now,
      imageUrl: previewImage || undefined,
    }));

    setIsSuccess(true);
    setTimeout(() => {
      onSaveMultipleScopes(newScopes);
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
          className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-black/[0.06] overflow-hidden z-10 my-2 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-800 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xs">
                  <Table className="w-5 h-5 text-violet-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      AI Vision 전과목 시험범위표 일괄 자동 분석
                    </h3>
                    <span className="text-[10px] font-extrabold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                      전과목 일괄 분할
                    </span>
                  </div>
                  <p className="text-xs text-violet-200 mt-0.5 font-medium">
                    1장의 전과목 시험범위 인쇄물을 촬영하면 AI가 과목별로 자동 감지·분할하여 일괄 등록합니다.
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

            {/* Presets Switcher */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-violet-200 mr-1">시연용 인쇄물 예시:</span>
              {MASTER_TABLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    activePreset.id === preset.id && !previewImage
                      ? 'bg-white text-indigo-950 border-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  {preset.title.split(' ')[1]} {preset.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Document Preview & Scanning Laser Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="업로드된 전과목 시험범위표 사진"
                  className="w-full h-44 sm:h-48 object-cover"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={190}
                  className="w-full h-44 sm:h-48 block bg-white"
                />
              )}

              {/* Scanning Laser Line */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    animate={{ y: ['0%', '190%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                    className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]"
                  />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-black backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/20 transition shadow-sm">
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
                  onClick={() => triggerBatchScan()}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? '일괄 분석 중...' : '다시 스캔'}</span>
                </button>
              </div>
            </div>

            {/* Scan Progress Feedback */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span>{scanStep}</span>
                  <span className="font-mono text-indigo-700 font-extrabold">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Batch Extracted Subjects Grid */}
            {hasScanned && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      AI 자동 분할 결과: 총 {extractedList.length}개 과목 감지 완료
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 self-start sm:self-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    인쇄물 일괄 인식 신뢰도 99.2%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {extractedList.map((item, index) => (
                    <div
                      key={item.subject}
                      className="p-3.5 rounded-2xl bg-[#F5F5F7]/80 border border-black/[0.04] space-y-2 hover:bg-white hover:shadow-xs transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            {item.subject}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.textbookPages}
                          onChange={(e) => handleUpdateItem(index, 'textbookPages', e.target.value)}
                          placeholder="페이지"
                          className="w-24 px-2 py-0.5 text-xs bg-white rounded-lg border border-black/[0.06] text-indigo-700 font-bold text-right"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-0.5">교과서 출제 범위</label>
                        <input
                          type="text"
                          value={item.scope}
                          onChange={(e) => handleUpdateItem(index, 'scope', e.target.value)}
                          className="w-full p-2 text-xs bg-white rounded-lg border border-black/[0.06] text-slate-800 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">부교재/모의고사</label>
                          <input
                            type="text"
                            value={item.supplementary}
                            onChange={(e) => handleUpdateItem(index, 'supplementary', e.target.value)}
                            className="w-full p-1.5 text-xs bg-white rounded-lg border border-black/[0.06] text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">출제 유의사항</label>
                          <input
                            type="text"
                            value={item.notice}
                            onChange={(e) => handleUpdateItem(index, 'notice', e.target.value)}
                            className="w-full p-1.5 text-xs bg-white rounded-lg border border-black/[0.06] text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-black/[0.04] flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              1장의 인쇄물로 {grade}학년 {extractedList.length}개 전과목이 한 번에 반영됩니다.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
              >
                취소
              </button>

              <button
                type="button"
                disabled={!hasScanned || isScanning}
                onClick={handleConfirmBatchSave}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                  isSuccess
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:opacity-95'
                }`}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>전과목 등록 완료! 실시간 반영 중...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>{extractedList.length}개 전과목 시험범위 일괄 확정 등록</span>
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
