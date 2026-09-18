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
