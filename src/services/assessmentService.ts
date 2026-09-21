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

  // 2학년 과목 (2026학년도 2학기 중간고사 공식 출제범위 일람표 실사 데이터 완비)
  // 1. 국영수 공통 및 선택
  {
    id: 'scope-g2-hwabeop',
    grade: 2,
    subject: '화법',
    status: 'announced',
    scope: '[교과서] 1. 우리말 돌아보기 - [1] 품사와 문장 구조(10~31쪽), [2] 단어의 짜임과 의미 관계(32~37쪽)',
    textbookPages: '10~37쪽',
    supplementary: '[수능 국어 문법 - 문제편] 1. 형태론 (단어) (3~84쪽), 2. 통사론 (문장) (85~123쪽)',
    notice: "시험 범위 외 고등학교 2학년 국어 전국연합학력평가 수준의 '외부 지문, <보기>, 개념 및 배경지식' 등 활용 가능",
    updatedAt: '10/12(월) 2교시',
  },
  {
    id: 'scope-eng2',
    grade: 2,
    subject: '영어2',
    status: 'announced',
    scope: '교과서 1과, 2과 (Further Reading 포함)',
    textbookPages: '1과, 2과',
    supplementary: "24', 25', 26' 고2 9월 학평 (듣기, 25, 26, 27, 28 제외)",
    notice: '모의고사 제외 문항(듣기, 25, 26, 27, 28번) 주의',
    updatedAt: '10/15(목) 1교시',
  },
  {
    id: 'scope-g2-hwaktong',
    grade: 2,
    subject: '확통',
    status: 'announced',
    scope: 'I. 경우의 수, II. 확률',
    textbookPages: '교과서 해당 단원',
    supplementary: '해당 범위의 기출문제 프린트',
    notice: '기출문제 프린트 중심 연계 출제',
    updatedAt: '10/15(목) 3교시',
  },
  {
    id: 'scope-calc2',
    grade: 2,
    subject: '미적2',
    status: 'announced',
    scope: '교과서 8~89쪽',
    textbookPages: '8~89쪽',
    supplementary: 'II. 미분법 까지의 5개년(2022-2026년 시행) 수능·모의평가·학력평가 기출문제 변형',
    notice: '기출문제 변형 출제 집중 대비',
    updatedAt: '10/12(월) 4교시',
  },
  {
    id: 'scope-g2-ecomath',
    grade: 2,
    subject: '경수',
    status: 'announced',
    scope: 'I 수와 경제 ~ II 함수와 경제 (11~108쪽)',
    textbookPages: '11~108쪽',
    supplementary: '경제 수학 교과서 및 부교재',
    notice: '경제 실생활 계산 및 함수 그래프 응용 문항',
    updatedAt: '10/12(월) 4교시',
  },
  // 2. 과학탐구 선택
  {
    id: 'scope-g2-mechanics',
    grade: 2,
    subject: '역학',
    status: 'announced',
    scope: '교과서 처음 ~ 68쪽 (17, 27쪽 제외)',
    textbookPages: '처음 ~ 68쪽',
    supplementary: '구글 클래스룸 탑재 학습 자료',
    notice: '17, 27쪽 제외 주의',
    updatedAt: '10/13(화) 2교시',
  },
  {
    id: 'scope-chem',
    grade: 2,
    subject: '물질',
    status: 'announced',
    scope: '[교과서] 8 ~ 69쪽, [교재] 처음 ~ 49쪽',
    textbookPages: '8 ~ 69쪽',
    supplementary: '[교재] 처음 ~ 49쪽',
    notice: '※ 단, 수업 중 제외 안내한 페이지는 포함X',
    updatedAt: '10/13(화) 1교시',
  },
  {
    id: 'scope-g2-cell',
    grade: 2,
    subject: '세포',
    status: 'announced',
    scope: '교과서 1. 세포 11~53쪽, 3. 세포호흡과 광합성 87~101쪽',
    textbookPages: '11~53쪽, 87~101쪽',
    supplementary: '세포와 물질대사 탐구 유인물',
    notice: '2단원 제외하고 3단원(세포호흡과 광합성) 출제 주의',
    updatedAt: '10/14(수) 4교시',
  },
  {
    id: 'scope-earth',
    grade: 2,
    subject: '지구',
    status: 'announced',
    scope: '교과서 I-01.지구의 탄생과 진화 ~ II-01.에크만 수송과 지형류 (12~61쪽)',
    textbookPages: '12~61쪽',
    supplementary: '교과서 범위에 해당하는 모든 학습지',
    notice: '교과서 범위 학습지 전수 포함',
    updatedAt: '10/14(수) 3교시',
  },
  // 3. 사회탐구 선택
  {
    id: 'scope-g2-hanji',
    grade: 2,
    subject: '한지',
    status: 'announced',
    scope: '교과서 처음 ~ 끝 (3-2, 3-3, 3-4 제외)',
    textbookPages: '처음 ~ 끝',
    supplementary: '한국지리 탐구 학습지',
    notice: '※ 학습지에 없는 교과서 내용 제외 (3-2, 3-3, 3-4 제외)',
    updatedAt: '10/13(화) 3교시',
  },
  {
    id: 'scope-g2-world',
    grade: 2,
    subject: '세계',
    status: 'announced',
    scope: '교과서 16~32쪽, 40~65쪽',
    textbookPages: '16~32쪽, 40~65쪽',
    supplementary: '세계사 탐구 프린트 및 연표',
    notice: '해당 범위 지도 및 주요 사건 연표 확인',
    updatedAt: '10/14(수) 4교시',
  },
  {
    id: 'scope-g2-econ',
    grade: 2,
    subject: '경제',
    status: 'announced',
    scope: '~ II. 미시경제 (99쪽)',
    textbookPages: '처음 ~ 99쪽',
    supplementary: '경제 탐구 워크북',
    notice: '미시경제 파트 주요 개념 중심 출제',
    updatedAt: '10/14(수) 2교시',
  },
  {
    id: 'scope-g2-intl',
    grade: 2,
    subject: '국제',
    status: 'announced',
    scope: '교과서 10~55쪽 + 교과서 172~187쪽',
    textbookPages: '10~55쪽, 172~187쪽',
    supplementary: '국제 관계의 이해 시사 유인물',
    notice: '건너뛴 교과서 페이지 주의 (56~171쪽 미포함)',
    updatedAt: '10/13(화) 4교시',
  },
  {
    id: 'scope-g2-ethics',
    grade: 2,
    subject: '윤리',
    status: 'announced',
    scope: '학습지 (유교, 불교, 도가, 고대 서양 사상, 행복 추구와 신앙)',
    textbookPages: '해당 단원 학습지 일체',
    supplementary: '유교, 불교, 도가, 서양 사상 학습지',
    notice: '※ 선택형 80점 + 서답형(단답형) 20점 (학습지 중점 출제)',
    updatedAt: '10/14(수) 1교시',
  },
  // 4. 제2외국어 (지필 실시)
  {
    id: 'scope-g2-japanese',
    grade: 2,
    subject: '일본어',
    status: 'announced',
    scope: '교과서 8~9쪽(일본은 어떤 나라일까요), 12~17쪽(오십음도 가타가나), 60~61쪽(일본의 유루캬라)',
    textbookPages: '8~9쪽, 12~17쪽, 60~61쪽',
    supplementary: '[Print] (전부) 일본의 연호, 일본의 지방, 가타가나 학습지',
    notice: '오십음도 가타가나 및 연호 학습지 암기 필수',
    updatedAt: '10/12(월) 3교시',
  },
  {
    id: 'scope-g2-chinese',
    grade: 2,
    subject: '중국어',
    status: 'announced',
    scope: '[교과서] 9~10(한눈에 보는 중국), 16~22(중국어의 발음), 26~34(처음 만나는 중국), 45, 78~79, 84~87(전통 명절), 90~101(중국 음식 여행), 140~141(주제로 알아보는 중국 6)',
    textbookPages: '해당 교과서 8개 파트',
    supplementary: '[프린트] (전부) 하나의 중국, 중국 요리 조리법&재료 중국어 명칭 등, 1과 수업 PPT(시험범위 보충)',
    notice: '※ 단, 수업 중 제외 안내한 페이지는 포함X',
    updatedAt: '10/12(월) 3교시',
  },
  // 5. 정보/공학 (지필 실시)
  {
    id: 'scope-g2-datascience',
    grade: 2,
    subject: '데과',
    status: 'announced',
    scope: 'I. 데이터 과학의 이해 ~ II. 데이터 준비와 분석 (교과서 10~101쪽)',
    textbookPages: '10~101쪽',
    supplementary: '데이터 분석 실습지 및 파이썬 코드',
    notice: '데이터 준비와 분석 개념 및 실습',
    updatedAt: '10/15(목) 2교시',
  },
  {
    id: 'scope-g2-creative-eng',
    grade: 2,
    subject: '창공',
    status: 'announced',
    scope: 'I. 창의 공학 설계의 이해 (교과서 10~77쪽)',
    textbookPages: '10~77쪽',
    supplementary: '창의 공학 설계 활동지 및 도면',
    notice: '공학 설계 프로세스 및 기법 적용',
    updatedAt: '10/15(목) 2교시',
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
      if (found) {
        // 만약 기존 저장본이 이미 공지된 내용(announced)과 범위를 갖고 있다면 그것을 우선 사용
        if (found.status === 'announced' && found.scope) {
          return { ...def, ...found };
        }
        // 반대로 기본값(def)이 최신 공식 발표 데이터(announced)이고 기존 캐시가 비어있다면 공식 발표 데이터 적용
        if (def.status === 'announced' && def.scope) {
          return { ...found, ...def };
        }
        return { ...def, ...found };
      }
      return def;
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
