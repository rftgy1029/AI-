# 서대전고등학교 스마트 포털 - 프로젝트 개발 및 수정 상세 내역서 (AI Context Document)

> **문서 목적**: 다른 AI 모델 및 개발자가 이 프로젝트의 아키텍처, 최근 수정 사항, 버그 픽스 내역, 권한 정책 및 데이터 흐름을 즉시 파악하고 원활하게 이어서 작업할 수 있도록 작성된 종합 컨텍스트 명세서입니다.

---

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트 명**: 서대전고등학교 스마트 학생 포털
- **학교 코드**: 대전광역시교육청 (`G10`) / 서대전고등학교 (`7430059`)
- **목적**: 서대전고등학교 학생 및 교직원을 위한 교육부 NEIS 실시간 공공데이터 연동(급식, 시간표, 학사일정) 및 컴시간 변경 시간표 안내, 실명 학생 건의게시판, WebAuthn 생체인증 관리자 포털
- **기술 스택**:
  - **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (Framer Motion), Lucide React
  - **Backend / Database**: Firebase Firestore, Firebase Auth (Named Database: `ai-studio-schoolhub-4a435f5a-4224-43b6-a9b7-0118644d6c3a`)
  - **External API**: 교육부 NEIS 오픈 API (`schoolInfo`, `mealServiceDietInfo`, `hisTimetable`, `SchoolSchedule`)
  - **Authentication**: WebAuthn 패스키 (생체인증/Windows Hello/화면잠금) + 관리자 마스터 패스코드

---

## 2. 핵심 수정 및 버그 픽스 상세 내역 (Changelog)

### [Feature 1] 게시글 등록 '등록 완료!' 시각 피드백 및 모달 자동 닫힘
- **문제점**:
  - 게시글 등록 시 Firestore `setDoc`이 오프라인 캐시나 네트워크 지연 상태일 때 비동기 완료를 무기한 대기하여 버튼이 '등록 중...' 상태로 멈추고 창이 닫히지 않는 문제 발생.
- **수정 내용**:
  - `src/services/firebaseService.ts`의 `createSuggestion`:
    - 로컬 스토리지에 즉시 저장 후, `Promise.race([setDocPromise, timeoutPromise])` 형태로 **2초 타임아웃 안전망**을 적용하여 UI가 멈추지 않고 즉시 완료 처리되도록 개선.
  - `src/components/CreateSuggestionModal.tsx`:
    - 등록 버튼 클릭 시 `Loader2` 회전 스피너와 함께 `등록 중...` 표시.
    - 등록이 성공하면 상단에 **초록색 완료 배너**(`CheckCircle2` + "등록이 완료되었습니다! 창이 곧 자동으로 닫힙니다...") 출력.
    - 버튼이 초록색 배경과 체크 아이콘의 `등록 완료!` 상태로 전환.
    - 확인 피드백 노출 후 **약 0.9초 뒤 폼 필드가 초기화되고 창이 자동으로 부드럽게 닫힘**.

---

### [Bug Fix 1] 게시글 작성 후 지워지던 치명적 데이터 소실 버그 픽스
- **문제점**:
  - 사용자가 새 건의글을 작성했으나 얼마 지나지 않아 목록에서 사라지는 심각한 버그 존재.
- **근본 원인 분석**:
  1. `src/services/firebaseService.ts`의 `subscribeToSuggestions`에서 Firestore `snapshot.empty`인 경우(DB가 비어있거나 동기화 전일 때) `saveLocalSuggestions([])`를 무조건 호출하여 **로컬에 방금 작성된 사용자의 글까지 전부 지워버리는 덮어쓰기 로직**이 있었음.
  2. `firebase-applet-config.json`에 `firestoreDatabaseId`가 지정되어 있었으나, `getFirestore(app)`으로만 호출되어 기본 DB`(default)`를 찾으면서 연결 오류 발생.
  3. `src/App.tsx`의 `handleCreateSuggestion`에서 React state(`setSuggestions`)를 직접 업데이트하지 않고 오직 Firestore 리스너의 이벤트만을 기다려 화면 반영 지연 및 누락 발생.
- **수정 내용**:
  - `firebaseService.ts`:
    - `firestoreDatabaseId`가 있을 때 `getFirestore(app, dbId)`로 정확한 Named Database 인스턴스에 연결.
    - Firestore가 비어 있더라도 로컬에 저장된 사용자 작성 글을 보존하며, Firestore 스냅샷 수신 시 아직 원격에 미반영된 최근 로컬 글을 **안전하게 병합(Merge)**.
  - `App.tsx`:
    - 글 작성(`handleCreateSuggestion`), 공감 투표(`handleToggleLike`), 댓글 등록(`handleAddComment`), 공식 답변(`handlePostReply`), 삭제(`handleDeleteSuggestion`) 시 **낙관적 UI 업데이트(Optimistic Update)** 를 적용하여 지연 없이 즉시 0ms로 화면에 반영 및 영구 보존.

---

### [Feature 2] 50분 수업 / 10분 쉬는 시간 및 실시간 남은 시간(분) 카운트다운
- **학교 일과 기준**:
  - **1교시**: 08:20 ~ 09:10 (50분) / **쉬는시간**: 09:10 ~ 09:20 (10분)
  - **2교시**: 09:20 ~ 10:10 (50분) / **쉬는시간**: 10:10 ~ 10:20 (10분)
  - **3교시**: 10:20 ~ 11:10 (50분) / **쉬는시간**: 11:10 ~ 11:20 (10분)
  - **4교시**: 11:20 ~ 12:10 (50분) / **점심시간**: 12:10 ~ 13:10 (60분)
  - **5교시**: 13:10 ~ 14:00 (50분) / **쉬는시간**: 14:00 ~ 14:10 (10분)
  - **6교시**: 14:10 ~ 15:00 (50분) / **쉬는시간**: 15:00 ~ 15:10 (10분)
  - **7교시**: 15:10 ~ 16:00 (50분)
- **수정 내용**:
  - `src/components/HomeDashboard.tsx` 상단 배너:
    - 잘못된 프로퍼티명(`periodInfo.timeRemainingMinutes`)을 실제 속성인 `periodInfo.remainingMinutes`로 수정하여 `현재 N교시 (N분 남음)` 출력 정상화.
    - 쉬는 시간(10분) 진행 중일 때: `쉬는 시간 (다음 N교시까지 N분 남음)`
    - 점심 시간 진행 중일 때: `점심시간 (5교시까지 N분 남음)`
  - `HomeDashboard.tsx` 오늘 시간표 카드:
    - 진행 중인 교시 우측 배지에 `진행 중 (N분 남음)` 및 애니메이션 핑 닷 추가.
  - `src/components/TimetableSection.tsx`:
    - 상단 배너, 일간 상세 뷰의 진행 중 교시 배지, 주간 전체 뷰 테이블 셀 안에 실시간으로 `진행 중 (N분 남음)` 카운트다운 배지 표시.

---

### [Feature 3] 게시글 답변 권한 분리 및 직급 선택창 개선
- **사용자 요청 사항**:
  - 관리자 모드일 때는 학생부, 교직원 등 학생보다 높은 직급만 공식 답변을 달 수 있게 하고 직급 선택창을 제공.
  - 일반 사용자(학생) 모드에서는 직급 선택창 및 공식 답변 작성 버튼을 완전히 제거하고 일반 댓글만 달 수 있도록 제한.
- **수정 내용**:
  - `src/components/SuggestionDetailModal.tsx`:
    - `isAdmin` 프로퍼티 추가 및 검증 로직 적용.
    - 일반 학생 모드(`!isAdmin`):
      - 공식 답변 작성 버튼 및 직급 선택창을 완전히 숨김.
      - 하단의 "실명 의견 및 동의 댓글" 영역에서 본인의 실명, 소속 학년/반으로 일반 댓글만 작성 가능.
    - 관리자 모드(`isAdmin === true`):
      - `공식 답변 작성하기` 버튼 노출.
      - **공식 부서/직급 선택 드롭다운** 제공:
        1. `학생생활안전부 (학생부)`
        2. `교무기획부 (교직원)`
        3. `제52대 총학생회`
        4. `진로진학상담부`
        5. `교육정보부`
        6. `행정실`
        7. `직접 입력` *(선택 시 자유롭게 직급/부서명 입력 가능)*
      - 처리 상태 변경: `답변완료 (해결 및 조치 결과 공식 안내)`, `검토중 (대의원회 및 교무부 검토 진행 중)`
  - `src/components/SuggestionBoardSection.tsx` & `src/App.tsx`:
    - `isAdmin` 상태를 최상위 `App`에서 `SuggestionBoardSection` ➡️ `SuggestionDetailModal`로 정확히 전달.

---

### [Bug Fix 2] 점심시간 카운트다운 배너 미작동 버그 수정
- **문제점**:
  - `HomeDashboard.tsx`와 `MealSection.tsx`에서 `mealStatus.isBeforeLunch`와 `mealStatus.timeUntilLunch`를 참조하고 있었으나, `src/utils/datetime.ts`의 `MealStatusInfo` 타입 및 함수 반환값에 해당 필드가 누락되어 있어 점심시간 전 카운트다운이 표시되지 않음.
- **수정 내용**:
  - `src/utils/datetime.ts`의 `MealStatusInfo` 인터페이스에 `isBeforeLunch: boolean`, `timeUntilLunch: string` 추가.
  - `getMealStatusInfo` 함수에서 12:10 이전 시간대에 `isBeforeLunch: true`, `timeUntilLunch: timeText` 반환.
  - 대시보드 및 급식 섹션에서 "점심시간까지 N시간 N분 남음 (12:10)" 배너가 정상 표시됨.

---

### [Bug Fix 3] 학사일정 연도 하드코딩 및 Fallback 보강
- **문제점**:
  - `src/services/neisService.ts`의 `fetchSeodaejeonSchedule` API URL에 `20250301~20260228`이 하드코딩되어 있어 2026년 3월 이후 일정 데이터가 누락됨.
- **수정 내용**:
  - `targetDate` 기준 현재 학년도를 동적 계산(`${schoolYear}0301 ~ ${schoolYear + 1}0228`)하여 NEIS API 요청.
  - NEIS API 응답이 없거나 공휴일/방학 기간일 때도 주요 시험/학사일정이 표시되도록 서대전고 공식 연간 학사일정 fallback 데이터 생성 함수 `getOfficialDefaultSchedule` 추가 및 병합.
  - 홈 대시보드 및 학사일정 탭에서 D-Day 임박 순서로 정렬(`.sort((a, b) => a.dDay - b.dDay)`).

---

### [Bug Fix 4] 학급 변경 모달(ClassChangeModal) 상태 동기화 누락 수정
- **문제점**:
  - 모달을 다시 열었을 때 `currentUser`의 최신 학년/반이 반영되지 않고 이전 값이나 3반이 기본값으로 고정되던 현상.
- **수정 내용**:
  - `ClassChangeModal.tsx`에 `useEffect`를 추가하여 `isOpen` 시 `currentUser.grade`, `currentUser.classNum`을 즉시 동기화하도록 수정하고 기본 반을 1반으로 정비.

---

### [Feature 4] 포털 전반 인터랙션 및 Apple 스타일 물리(Spring) 애니메이션 전면 고도화
- **작업 배경**:
  - 기존 UI의 화면 및 탭 전환이 정적이거나 일부 모달의 닫힘 애니메이션이 즉시 끊기는 현상이 있어, 전반적인 사용자 경험을 Apple/iOS처럼 유기적이고 부드러운 인터랙션으로 개선.
- **수정 및 고도화 내역**:
  1. **전역 라우트 & 탭 전환 트랜지션 (`src/App.tsx`)**:
     - 탭 전환 시 cubic-bezier(`[0.22, 1, 0.36, 1]`) 기반의 부드러운 페이드-슬라이드 트랜지션(`opacity: 0, y: 10` → `opacity: 1, y: 0`) 적용.
  2. **상단 & 모바일 내비게이션 바 (`src/components/Navbar.tsx`)**:
     - **데스크톱**: 탭 클릭 시 활성 캡슐 배경이 미끄러지듯 이동하는 `layoutId="activeTabBadge"` 스프링 애니메이션 적용.
     - **모바일**: 하단 네비게이션 탭 터치 시 액티브 배경(`layoutId="mobileNavActivePill"`)과 상단 닷 인디케이터(`mobileActiveDot`)가 자연스럽게 이동하며, 가벼운 햅틱 반응(`whileTap={{ scale: 0.92 }}`) 제공.
  3. **메인 대시보드 (`src/components/HomeDashboard.tsx`)**:
     - 상단 환영 배너 및 4개 Bento 카드(급식, 시간표, 일정, 건의함)에 계단식(Stagger, `staggerChildren: 0.07`) 순차 진입 애니메이션 적용.
     - 카드 마우스 호버 시 부드러운 부유감(`whileHover={{ y: -4, scale: 1.01 }}`) 및 액션 버튼 클릭 피드백 추가.
  4. **오늘의 급식 (`src/components/MealSection.tsx`)**:
     - 중식/석식 세그먼트 전환(`layoutId="mealTypeActiveBg"`) 및 요일 탭(`layoutId="mealDateActiveBg"`)에 슬라이딩 알약 인디케이터 적용.
     - 메뉴 카드 순차 등장 및 알레르기 안내 아코디언 높이(`height: 'auto'`) 확장 애니메이션 적용.
  5. **실시간 시간표 (`src/components/TimetableSection.tsx`)**:
     - 일간/주간 뷰 세그먼트(`layoutId="timetableViewModePill"`) 및 요일 탭(`layoutId="timetableDayPill"`)에 슬라이딩 인디케이터 적용.
     - 1~7교시 카드 순차 등장 및 현재 진행 중인 교시 카드에 펄스 강조 효과 적용.
  6. **학사일정 & 학생 건의게시판 (`src/components/ScheduleSection.tsx`, `src/components/SuggestionBoardSection.tsx`)**:
     - 카테고리/정렬 필터 변경 시 `AnimatePresence mode="popLayout"`으로 겹침 없는 부드러운 레이아웃 재배치 구현.
     - 건의글 공감(좋아요) 버튼 클릭 시 통통 튀는 탄성 반응(`whileTap={{ scale: 1.25 }}`) 적용.
  7. **모달 5종 진입/퇴장 애니메이션 구조 개선 (`ClassChangeModal`, `CreateSuggestionModal`, `SuggestionDetailModal`, `AddScheduleModal`, `PasskeyAuthModal`)**:
     - **근본 원인**: `if (!isOpen) return null;` 조기 리턴으로 인해 컴포넌트가 언마운트되어 `<AnimatePresence>`의 퇴장(exit) 애니메이션이 실행되지 못하고 즉시 사라지던 문제.
     - **해결**: 모든 모달 컴포넌트를 최상위 `<AnimatePresence>` 내부에 `{isOpen && (...)}` 렌더링 패턴으로 정비하여 딤 백드롭 페이드아웃 및 팝업/바텀시트 축소 애니메이션이 매끄럽게 재생되도록 보장.

---

### [Feature 5] 반별 교사 상이로 인한 시간표 내 담당 교사명 표시 조정
- **작업 배경**:
  - 서대전고등학교 각 학년/반마다 담당 교과목 교사가 상이하므로, 이전 더미 데이터의 하드코딩된 교사명 노출을 정리함.

---

### [Feature 6] 컴시간 알리미(Comcigan) 실시간 시간표 연동(방법 1) 및 NEIS 급식표 100% 보존
- **작업 배경**:
  - 실제 학교 현장에서 변동되는 교체 시간표를 실시간 반영하기 위해 컴시간 알리미 데이터를 포털에 직접 연동.
  - 사용자 필수 요청사항: **급식표는 NEIS 공공데이터 그대로 100% 보존**, **시간표만 컴시간 알리미로 교체**, **컴시간 알리미의 정확한 실시간 담당 교사명은 유지**.
- **구현 내용**:
  1. **컴시간 파싱 백엔드 서비스 구축 (`src/server/comciganService.ts`)**:
     - `comcigan-parser`를 통해 서대전고등학교(학교 코드: `71433`) 실시간 시간표를 5분 인메모리 캐시로 조회.
  2. **Vite 개발 서버 미들웨어 통합 (`vite.config.ts`)**:
     - `comciganApiPlugin`을 추가하여 `npm run dev` 실행 시 `/api/timetable?grade=N&class=N` 엔드포인트 자동 제공 (원클릭 개발 환경).
  3. **프로덕션 Express 서버 구축 (`server.ts`, `package.json`)**:
     - 배포 환경을 위한 Express 서버 및 `"start": "tsx server.ts"` 스크립트 제공.
  4. **시간표 데이터 파이프라인 교체 (`src/services/neisService.ts`)**:
     - `fetchSeodaejeonTimetable`: `/api/timetable`을 호출하여 컴시간 실시간 시간표와 실시간 교사명을 `TimetableDay[]`로 파싱.
     - 컴시간 일시 점검이나 오프라인 시 공식 교육과정 시간표로 즉시 안전하게 Fallback.
     - **급식표(`fetchSeodaejeonMeals`) 및 학사일정(`fetchSeodaejeonSchedule`)은 교육부 NEIS 오픈 API 100% 그대로 보존**.
  5. **UI 교사명 표시 복원 (`HomeDashboard.tsx`, `TimetableSection.tsx`)**:
     - 컴시간 실시간 데이터에 포함된 교사명이 있을 경우 `({p.teacher})` 및 `{p.teacher} 선생님` 배지가 자연스럽게 표시되도록 복원.

---

### [Feature 7] 컴시간 실시간 변경 수업 자동 감지 및 범례 문구 정리 ("노란색: 시간표 변경")
- **작업 배경**:
  - 기존의 하드코딩된 '원래 진로' 문구를 제거하고 주간 전체 시간표 범례를 깔끔하게 "노란색: 시간표 변경"으로 표준화.
  - 서대전고등학교 전 학년, 전 학급의 실시간 변경 수업을 컴시간 알리미 원천 패킷(자료147 및 자료481 비교)에서 100% 자동 감지하도록 백엔드 파서 고도화.
- **수정 내용**:
  1. `src/server/comciganService.ts`:
     - 컴시간 내부의 `일일자료(자료147)`와 `원자료(자료481)`를 직접 비교하여 `속성 === '변경'` 여부(`isChanged: true`) 및 `originalSubject`, `originalTeacher`를 실시간으로 자동 디코딩.
  2. `src/services/neisService.ts`:
     - 특정 교시(목요일 5교시)에 국한되던 하드코딩 분기를 제거하고, API 응답의 `item.isChanged`와 `item.originalSubject`를 동적으로 바인딩.
  3. `src/components/TimetableSection.tsx`:
     - 주간 전체 시간표 우측 상단 범례 배지: `"노란색: 시간표 변경 (원래 진로)"` ➡️ `"노란색: 시간표 변경"`으로 문구 정비.
     - 일간 뷰 안내 배너: `"노란색 박스는 변경된 수업입니다 (원래 진로 시간에서 변경됨)"` ➡️ `"노란색 카드는 컴시간 알리미에서 실시간 변경된 수업입니다"`로 수정.
     - 개별 교시 배지: 하드코딩된 `'진로'` 폴백을 제거하고 원래 과목이 있을 때만 `(원래: OO)` 표시.
  4. `src/components/HomeDashboard.tsx`:
     - 시간표 카드 내 변경 배지 문구를 `시간표 변경 (원래: OO)` 형태로 통일 및 `'진로'` 하드코딩 제거.

---

## 3. 소스 코드 디렉토리 구조 및 핵심 파일 가이드

```
src/
├── App.tsx                        # 루트 컴포넌트, 상태 관리 (사용자, 탭, NEIS 데이터, 관리자 인증)
├── index.css                      # Tailwind v4 스타일 및 전역 폰트/디자인
├── main.tsx                       # React DOM 진입점
├── types.ts                       # 공통 데이터 인터페이스 (MealItem, TimetableDay, SuggestionItem 등)
├── components/
│   ├── Navbar.tsx                 # 상단 네비게이션 및 프로필/관리자 버튼
│   ├── HomeDashboard.tsx          # 메인 대시보드 (현재 교시 안내, 오늘의 급식, 시간표, D-Day)
│   ├── MealSection.tsx            # 급식 상세 뷰 (중식/석식 탭, 영양성분, 알레르기)
│   ├── TimetableSection.tsx       # 시간표 뷰 (일간 상세, 주간 전체, 컴시간 변경 과목 반영)
│   ├── ScheduleSection.tsx        # 학사일정 캘린더 (D-Day 필터, 관리자 일정 추가)
│   ├── SuggestionBoardSection.tsx # 실명 학생 건의게시판 목록
│   ├── SuggestionDetailModal.tsx  # 건의글 상세 모달 (공식 답변, 일반 댓글, 삭제)
│   ├── CreateSuggestionModal.tsx  # 건의글 작성 모달 (등록 중/완료 애니메이션, 자동 닫힘)
│   ├── ClassChangeModal.tsx       # 학년/반 선택 모달
│   ├── PasskeyAuthModal.tsx       # WebAuthn 생체인증 / 마스터키 로그인 모달
│   └── AddScheduleModal.tsx       # 관리자 학사일정 등록 모달
├── services/
│   ├── neisService.ts             # NEIS Open API 연동 및 서대전고 fallback 데이터
│   ├── firebaseService.ts         # Firestore 실시간 구독, CRUD, 안전한 로컬 스토리지 캐싱
│   ├── passkeyService.ts          # WebAuthn 패스키 등록, 인증 및 세션 관리
│   └── customScheduleService.ts   # 관리자 추가 커스텀 학사일정 저장/병합
└── utils/
    ├── datetime.ts                # 한국표준시(KST) 변환, 교시 계산(50분 수업/10분 휴식), 급식 상태
    └── useIsMobile.ts             # 모바일 반응형 감지 훅
```

---

## 4. 빌드 및 실행 명령어 가이드

```powershell
# 개발 서버 실행 (포트 3000)
npm run dev

# TypeScript 타입 검사
npm run lint

# 프로덕션 빌드
npm run build

# Git 상태 확인 및 동기화
git status
git push origin main
```

---
*본 문서는 프로젝트의 안정적인 유지보수와 협업을 위해 자동 생성되었습니다.*
