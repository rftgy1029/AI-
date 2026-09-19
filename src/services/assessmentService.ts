export interface AssessmentInfo {
  id: string;
  grade: number;
  classNum?: number; // 특정 반 대상 (undefined면 해당 학년 전체)
  day: '월' | '화' | '수' | '목' | '금';
  period: number;
  subject: string;
  title: string;
  type: '논술형' | '실험·실습' | '발표' | '포트폴리오' | '보고서' | '구술평가';
  weight: string; // e.g. "15%"
  dueDate?: string;
  description: string;
  materials?: string; // 준비물
  notice?: string;
}

export interface ExamScopeItem {
  id: string;
  grade: number;
  subject: string;
  status: 'announced' | 'pending';
  scope?: string;
  textbookPages?: string;
  supplementary?: string; // 부교재/모의고사/프린트
  notice?: string;
  updatedAt?: string;
  imageUrl?: string;
}

const DEFAULT_ASSESSMENTS: AssessmentInfo[] = [
  {
    id: 'assess-eng2-fri2',
    grade: 2,
    classNum: 1,
    day: '금',
    period: 2,
    subject: '영어2',
    title: 'Lesson 4 심층 독해 및 조건부 영작문 논술 평가',
    type: '논술형',
    weight: '15%',
    dueDate: '2026-09-19(금) 2교시',
    description: '교과서 Lesson 4 본문 핵심 쟁점을 분석하고, 주어진 조건(어휘 5종 포함, 150단어 내외)에 맞춰 논술형 에세이를 작성합니다.',
    materials: '검정색 볼펜, 수정테이프 (전자사전·단어장 지참 불가)',
    notice: '당일 미응시 시 학교 학업성적관리규정에 따른 인정점 부여 (공결 사유 증빙 필요)',
  },
  {
    id: 'assess-chem-fri3',
    grade: 2,
    classNum: 1,
    day: '금',
    period: 3,
    subject: '화학',
    title: '원소의 주기적 성질 탐구 실험 및 결과 보고서',
    type: '실험·실습',
    weight: '20%',
    dueDate: '2026-09-19(금) 3교시',
    description: '3주기 원소의 성질 변화 및 할로젠 원소의 반응성을 직접 실험·관찰하고, 조별 측정 데이터 기반 개별 보고서를 현장에서 작성하여 제출합니다.',
    materials: '실험복 필수 착용, 실험 활동지, 필기도구',
    notice: '실험실 안전 규정 미준수 시 감점 처리되니 보안경 및 복장을 필히 준수 바랍니다.',
  },
  {
    id: 'assess-korean-wed4',
    grade: 2,
    classNum: 1,
    day: '수',
    period: 4,
    subject: '화법',
    title: '시사 쟁점 찬반 토론 개요서 작성 및 3분 구술 발표',
    type: '발표',
    weight: '15%',
    dueDate: '2026-09-24(수) 4교시',
    description: '현대 사회 주요 쟁점에 대한 찬반 논거를 수집하고, 입론서 개요를 작성한 뒤 3분간 설득적 구술 발표를 진행합니다.',
    materials: '토론 개요서 1부',
    notice: '발표 시간 엄수 (3분 초과 시 감점)',
  },
  {
    id: 'assess-earth-thu5',
    grade: 2,
    classNum: 1,
    day: '목',
    period: 5,
    subject: '지구',
    title: '지질 시대와 지구 환경 변화 탐구 포트폴리오',
    type: '포트폴리오',
    weight: '15%',
    dueDate: '2026-09-25(목) 5교시',
    description: '고생대부터 신생대까지의 기후 변화와 화석 산출 양상을 정리한 탐구 마인드맵 및 개인 탐구 보고서 제출',
    materials: 'A4 포트폴리오 바인더',
    notice: '표절 검사 실시 예정',
  },
];

export const DEFAULT_EXAM_SCOPES: ExamScopeItem[] = [
  // 1학년 과목
  {
    id: 'scope-g1-korean',
    grade: 1,
    subject: '국어',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g1-math',
    grade: 1,
    subject: '수학',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g1-english',
    grade: 1,
    subject: '영어',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g1-history',
    grade: 1,
    subject: '한국사',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g1-society',
    grade: 1,
    subject: '통합사회',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g1-science',
    grade: 1,
    subject: '통합과학',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },

  // 2학년 과목
  // 1. 국영수 공통 및 선택
  {
    id: 'scope-g2-hwabeop',
    grade: 2,
    subject: '화법',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-eng2',
    grade: 2,
    subject: '영어2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-hwaktong',
    grade: 2,
    subject: '확통',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-calc2',
    grade: 2,
    subject: '미적2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-ecomath',
    grade: 2,
    subject: '경수',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 2. 과학탐구 선택
  {
    id: 'scope-g2-mechanics',
    grade: 2,
    subject: '역학',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-chem',
    grade: 2,
    subject: '물질',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-cell',
    grade: 2,
    subject: '세포',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-earth',
    grade: 2,
    subject: '지구',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 3. 사회탐구 선택
  {
    id: 'scope-g2-hanji',
    grade: 2,
    subject: '한지',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-world',
    grade: 2,
    subject: '세계',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-econ',
    grade: 2,
    subject: '경제',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-intl',
    grade: 2,
    subject: '국제',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-ethics',
    grade: 2,
    subject: '윤리',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 4. 제2외국어 (지필 실시)
  {
    id: 'scope-g2-japanese',
    grade: 2,
    subject: '일본어',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-chinese',
    grade: 2,
    subject: '중국어',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 5. 정보/공학 (지필 실시)
  {
    id: 'scope-g2-datascience',
    grade: 2,
    subject: '데과',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g2-creative-eng',
    grade: 2,
    subject: '창공',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },

  // 3학년 과목 (서대전고 컴시간 실시간 공식 지필평가 과목)
  // 1. 국영수 공통 및 심화/선택
  {
    id: 'scope-g3-simguk',
    grade: 3,
    subject: '심국',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-simyeong',
    grade: 3,
    subject: '심영',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-giha',
    grade: 3,
    subject: '기하',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-gosu',
    grade: 3,
    subject: '고수',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-susa',
    grade: 3,
    subject: '수사',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 2. 과학탐구 Ⅱ과목
  {
    id: 'scope-g3-physics2',
    grade: 3,
    subject: '물리2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-chem2',
    grade: 3,
    subject: '화학2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-bio2',
    grade: 3,
    subject: '생명2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-earth2',
    grade: 3,
    subject: '지구2',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 3. 사회탐구 과목
  {
    id: 'scope-g3-samun',
    grade: 3,
    subject: '사문',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-politics',
    grade: 3,
    subject: '정치',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-ethics',
    grade: 3,
    subject: '윤리',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-seji',
    grade: 3,
    subject: '세지',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  {
    id: 'scope-g3-segye',
    grade: 3,
    subject: '세계',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
  // 4. 논술
  {
    id: 'scope-g3-nonsul',
    grade: 3,
    subject: '논술',
    status: 'pending',
    scope: '',
    textbookPages: '',
    supplementary: '',
    notice: '',
    updatedAt: '',
  },
];

const ASSESSMENTS_STORAGE_KEY = 'sdj_assessments_v3';
const EXAM_SCOPES_STORAGE_KEY = 'sdj_exam_scopes_v4';

export function getAssessments(grade: number, classNum?: number): AssessmentInfo[] {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
    const list: AssessmentInfo[] = raw ? JSON.parse(raw) : DEFAULT_ASSESSMENTS;
    return list.filter((a) => a.grade === grade && (!a.classNum || !classNum || a.classNum === classNum));
  } catch {
    return DEFAULT_ASSESSMENTS.filter((a) => a.grade === grade);
  }
}

export function getAssessmentForPeriod(
  grade: number,
  classNum: number,
  day: '월' | '화' | '수' | '목' | '금',
  period: number,
  subject?: string
): AssessmentInfo | undefined {
  const all = getAssessments(grade, classNum);
  return all.find(
    (a) =>
      a.day === day &&
      a.period === period &&
      (!subject || a.subject.includes(subject) || subject.includes(a.subject))
  );
}

export function getExamScopes(grade: number): ExamScopeItem[] {
  try {
    const raw = localStorage.getItem(EXAM_SCOPES_STORAGE_KEY);
    if (!raw) return DEFAULT_EXAM_SCOPES.filter((s) => s.grade === grade);
    const list: ExamScopeItem[] = JSON.parse(raw);
    const defaults = DEFAULT_EXAM_SCOPES.filter((s) => s.grade === grade);
    // Ensure all default subjects are present even if local cache was from an older version
    const merged = defaults.map((def) => {
      const found = list.find(
        (s) => s.id === def.id || (s.grade === def.grade && s.subject === def.subject)
      );
      return found ? { ...def, ...found } : def;
    });
    // Append any extra subjects that were stored
    for (const item of list.filter((s) => s.grade === grade)) {
      if (!merged.some((m) => m.id === item.id || (m.grade === item.grade && m.subject === item.subject))) {
        merged.push(item);
      }
    }
    return merged;
  } catch {
    return DEFAULT_EXAM_SCOPES.filter((s) => s.grade === grade);
  }
}

export function saveAssessment(assessment: AssessmentInfo) {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
    const list: AssessmentInfo[] = raw ? JSON.parse(raw) : [...DEFAULT_ASSESSMENTS];
    const idx = list.findIndex((a) => a.id === assessment.id);
    if (idx >= 0) {
      list[idx] = assessment;
    } else {
      list.push(assessment);
    }
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save assessment', err);
  }
}

export function saveExamScope(scope: ExamScopeItem) {
  try {
    const raw = localStorage.getItem(EXAM_SCOPES_STORAGE_KEY);
    const list: ExamScopeItem[] = raw ? JSON.parse(raw) : [...DEFAULT_EXAM_SCOPES];
    const idx = list.findIndex((s) => s.id === scope.id || (s.grade === scope.grade && s.subject === scope.subject));
    if (idx >= 0) {
      list[idx] = scope;
    } else {
      list.push(scope);
    }
    localStorage.setItem(EXAM_SCOPES_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save exam scope', err);
  }
}

export function saveMultipleExamScopes(newScopes: ExamScopeItem[]) {
  try {
    const raw = localStorage.getItem(EXAM_SCOPES_STORAGE_KEY);
    const list: ExamScopeItem[] = raw ? JSON.parse(raw) : [...DEFAULT_EXAM_SCOPES];
    for (const scope of newScopes) {
      const idx = list.findIndex((s) => s.id === scope.id || (s.grade === scope.grade && s.subject === scope.subject));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...scope };
      } else {
        list.push(scope);
      }
    }
    localStorage.setItem(EXAM_SCOPES_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save multiple exam scopes', err);
  }
}
