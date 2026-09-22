// 서대전고등학교 1~3학년 전 학급(1~10반) 컴시간 알리미 공식 실시간 주간 시간표 데이터
// 전 학급(30개 학급) 고유 매핑으로 옆반 시간표 중복/복사 오류를 원천 차단합니다.

export interface StaticPeriodEntry {
  period: number;
  subject: string;
  teacher?: string;
  isChanged?: boolean;
  originalSubject?: string;
}

export const SEODAEJEON_MASTER_TIMETABLE: Record<
  string,
  Record<"월" | "화" | "수" | "목" | "금", StaticPeriodEntry[]>
> = {
  "1-1": {
    "월": [
      {
        "period": 2,
        "subject": "통과2",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "글로",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": true,
        "originalSubject": "국어2"
      },
      {
        "period": 2,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": true,
        "originalSubject": "체육2"
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": true,
        "originalSubject": "한국2"
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": true,
        "originalSubject": "공영2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "글로",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      }
    ]
  },
  "1-2": {
    "월": [
      {
        "period": 2,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 4,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": true,
        "originalSubject": "과탐"
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": true,
        "originalSubject": "체육2"
      },
      {
        "period": 2,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": true,
        "originalSubject": "진로"
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": true,
        "originalSubject": "국어2"
      },
      {
        "period": 6,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": true,
        "originalSubject": "글로"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      }
    ]
  },
  "1-3": {
    "월": [
      {
        "period": 2,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "과탐",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 2,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": true,
        "originalSubject": "공영2"
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": true,
        "originalSubject": "체육2"
      },
      {
        "period": 7,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": true,
        "originalSubject": "음악"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "체육2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": false
      }
    ]
  },
  "1-4": {
    "월": [
      {
        "period": 2,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "체육2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "글로",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": true,
        "originalSubject": "음악"
      },
      {
        "period": 2,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": true,
        "originalSubject": "공영2"
      },
      {
        "period": 3,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "조수",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": true,
        "originalSubject": "글로"
      },
      {
        "period": 6,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 7,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": true,
        "originalSubject": "국어2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "유순",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      }
    ]
  },
  "1-5": {
    "월": [
      {
        "period": 2,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "글로",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": true,
        "originalSubject": "글로"
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": true,
        "originalSubject": "한국2"
      },
      {
        "period": 3,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": true,
        "originalSubject": "음악"
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": true,
        "originalSubject": "국어2"
      },
      {
        "period": 7,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": true,
        "originalSubject": "통과2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "임진",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체육2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "과탐",
        "teacher": "손거",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "손승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "음악",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공수2",
        "teacher": "임현",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공영2",
        "teacher": "김태",
        "isChanged": false
      }
    ]
  },
  "1-6": {
    "월": [
      {
        "period": 2,
        "subject": "통과2",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "자탐",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": true,
        "originalSubject": "자탐"
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": true,
        "originalSubject": "통사2"
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 6,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": true,
        "originalSubject": "미술"
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": true,
        "originalSubject": "과탐"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "김태",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김혜",
        "isChanged": false
      }
    ]
  },
  "1-7": {
    "월": [
      {
        "period": 2,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "자탐",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": true,
        "originalSubject": "공영2"
      },
      {
        "period": 2,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 3,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "과탐",
        "teacher": "손거",
        "isChanged": true,
        "originalSubject": "자탐"
      },
      {
        "period": 6,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 7,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": true,
        "originalSubject": "통사2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "통과2",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "서한",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "한국2",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "과탐",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      }
    ]
  },
  "1-8": {
    "월": [
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김형",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "자탐",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": true,
        "originalSubject": "미술"
      },
      {
        "period": 2,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": true,
        "originalSubject": "한국2"
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "자탐",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 6,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": true,
        "originalSubject": "공영2"
      },
      {
        "period": 7,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": true,
        "originalSubject": "체육2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "통과2",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "최이",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "자탐",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      }
    ]
  },
  "1-9": {
    "월": [
      {
        "period": 2,
        "subject": "자탐",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통과2",
        "teacher": "오동",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "통사2",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "자탐",
        "teacher": "정순",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 2,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": true,
        "originalSubject": "국어2"
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": true,
        "originalSubject": "통사2"
      },
      {
        "period": 6,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": true,
        "originalSubject": "진로"
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": true,
        "originalSubject": "공영2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "통과2",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "국어2",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "자탐",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      }
    ]
  },
  "1-10": {
    "월": [
      {
        "period": 2,
        "subject": "통사2",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "자탐",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "통과2",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "공수2",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "국어2",
        "teacher": "정순",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": true,
        "originalSubject": "공수2"
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": true,
        "originalSubject": "체육2"
      },
      {
        "period": 3,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "자탐",
        "teacher": "전고",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": true,
        "originalSubject": "통과2"
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": true,
        "originalSubject": "국어2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "공영2",
        "teacher": "이윤",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "특색",
        "teacher": "정연",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통과2",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "통사2",
        "teacher": "김형",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "과탐",
        "teacher": "이호",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한국2",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "미술",
        "teacher": "강윤",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "체육2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "자탐",
        "teacher": "전고",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "통사2",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "공수2",
        "teacher": "김경",
        "isChanged": false
      }
    ]
  },
  "2-1": {
    "월": [
      {
        "period": 2,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": true,
        "originalSubject": "중국"
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": true,
        "originalSubject": "데과"
      },
      {
        "period": 2,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "화법"
      },
      {
        "period": 3,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": true,
        "originalSubject": "확통"
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": true,
        "originalSubject": "미적2"
      },
      {
        "period": 7,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": true,
        "originalSubject": "물질"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      }
    ]
  },
  "2-2": {
    "월": [
      {
        "period": 2,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": true,
        "originalSubject": "일본"
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": true,
        "originalSubject": "창공"
      },
      {
        "period": 2,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": true,
        "originalSubject": "미적2"
      },
      {
        "period": 3,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": true,
        "originalSubject": "확통"
      },
      {
        "period": 6,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": true,
        "originalSubject": "영어2"
      },
      {
        "period": 7,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": true,
        "originalSubject": "화법"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "물질",
        "teacher": "오동",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      }
    ]
  },
  "2-3": {
    "월": [
      {
        "period": 2,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": true,
        "originalSubject": "세계"
      },
      {
        "period": 2,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": true,
        "originalSubject": "윤리"
      },
      {
        "period": 3,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": true,
        "originalSubject": "데과"
      },
      {
        "period": 6,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": true,
        "originalSubject": "국제"
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "확통"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      }
    ]
  },
  "2-4": {
    "월": [
      {
        "period": 2,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": true,
        "originalSubject": "경제"
      },
      {
        "period": 2,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": true,
        "originalSubject": "국제"
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": true,
        "originalSubject": "창공"
      },
      {
        "period": 6,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": true,
        "originalSubject": "윤리"
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": true,
        "originalSubject": "확통"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "윤리",
        "teacher": "김기",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      }
    ]
  },
  "2-5": {
    "월": [
      {
        "period": 2,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "경수",
        "teacher": "송영",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": true,
        "originalSubject": "국제"
      },
      {
        "period": 2,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": true,
        "originalSubject": "세계"
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": true,
        "originalSubject": "경수"
      },
      {
        "period": 6,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": true,
        "originalSubject": "경제"
      },
      {
        "period": 7,
        "subject": "경수",
        "teacher": "송영",
        "isChanged": true,
        "originalSubject": "영어2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "화법",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "신순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "국제",
        "teacher": "김혜",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "경제",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "세계",
        "teacher": "김중",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "경수",
        "teacher": "송영",
        "isChanged": false
      }
    ]
  },
  "2-6": {
    "월": [
      {
        "period": 2,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "스생2",
        "teacher": "김종",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": true,
        "originalSubject": "역학"
      },
      {
        "period": 2,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": true,
        "originalSubject": "지구"
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": true,
        "originalSubject": "미적2"
      },
      {
        "period": 6,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": true,
        "originalSubject": "물질"
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": true,
        "originalSubject": "일본"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "지구",
        "teacher": "정영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      }
    ]
  },
  "2-7": {
    "월": [
      {
        "period": 2,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": true,
        "originalSubject": "물질"
      },
      {
        "period": 2,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": true,
        "originalSubject": "역학"
      },
      {
        "period": 3,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": true,
        "originalSubject": "스생2"
      },
      {
        "period": 6,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": true,
        "originalSubject": "세포"
      },
      {
        "period": 7,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": true,
        "originalSubject": "데과"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      }
    ]
  },
  "2-8": {
    "월": [
      {
        "period": 2,
        "subject": "경수",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "경수",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": true,
        "originalSubject": "한지"
      },
      {
        "period": 2,
        "subject": "한지",
        "teacher": "최종",
        "isChanged": true,
        "originalSubject": "세포"
      },
      {
        "period": 3,
        "subject": "경수",
        "teacher": "하재",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": true,
        "originalSubject": "화법"
      },
      {
        "period": 6,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": true,
        "originalSubject": "지구"
      },
      {
        "period": 7,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": true,
        "originalSubject": "창공"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "한지",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "영어2",
        "teacher": "김지",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "스생2",
        "teacher": "서의",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "한지",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "경수",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "지구",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      }
    ]
  },
  "2-9": {
    "월": [
      {
        "period": 2,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "스생2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": true,
        "originalSubject": "화법"
      },
      {
        "period": 2,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": true,
        "originalSubject": "확통"
      },
      {
        "period": 3,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": true,
        "originalSubject": "중국"
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": true,
        "originalSubject": "역학"
      },
      {
        "period": 7,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": true,
        "originalSubject": "미적2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "미적2",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "데과",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "중국",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      }
    ]
  },
  "2-10": {
    "월": [
      {
        "period": 2,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "스생2",
        "teacher": "김한",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "영어2",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": true,
        "originalSubject": "영어2"
      },
      {
        "period": 2,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": true,
        "originalSubject": "확통"
      },
      {
        "period": 3,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": true,
        "originalSubject": "일본"
      },
      {
        "period": 6,
        "subject": "스생2",
        "teacher": "서의",
        "isChanged": true,
        "originalSubject": "화법"
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": true,
        "originalSubject": "세포"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "물질",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "손거",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "확통",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "세포",
        "teacher": "윤하",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "창공",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "역학",
        "teacher": "박조",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "일본",
        "teacher": "송수",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "화법",
        "teacher": "한동",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "스생2",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "미적2",
        "teacher": "안상",
        "isChanged": false
      }
    ]
  },
  "3-1": {
    "월": [
      {
        "period": 2,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "수사",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "세계",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "수과",
        "teacher": "김효",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": true,
        "originalSubject": "수과"
      },
      {
        "period": 3,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": true,
        "originalSubject": "세계"
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": true,
        "originalSubject": "생환"
      },
      {
        "period": 7,
        "subject": "세계",
        "teacher": "남재",
        "isChanged": true,
        "originalSubject": "수사"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "수과",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "수사",
        "teacher": "송영",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "세계",
        "teacher": "남재",
        "isChanged": false
      }
    ]
  },
  "3-2": {
    "월": [
      {
        "period": 2,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "고수",
        "teacher": "박종",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "수사",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "세지",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "남재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": true,
        "originalSubject": "심영"
      },
      {
        "period": 2,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "고수"
      },
      {
        "period": 3,
        "subject": "세지",
        "teacher": "최종",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": true,
        "originalSubject": "생환"
      },
      {
        "period": 6,
        "subject": "수사",
        "teacher": "이희",
        "isChanged": true,
        "originalSubject": "세지"
      },
      {
        "period": 7,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": true,
        "originalSubject": "수사"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "고수",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "세지",
        "teacher": "최종",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "체탐",
        "teacher": "서의",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "수사",
        "teacher": "이희",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": false
      }
    ]
  },
  "3-3": {
    "월": [
      {
        "period": 2,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "수과",
        "teacher": "전순",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "논술",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "생환",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "수사",
        "teacher": "하재",
        "isChanged": true,
        "originalSubject": "수사"
      },
      {
        "period": 2,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": true,
        "originalSubject": "수과"
      },
      {
        "period": 3,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "생환",
        "teacher": "서준",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": true,
        "originalSubject": "정치"
      },
      {
        "period": 6,
        "subject": "수사",
        "teacher": "임재",
        "isChanged": true,
        "originalSubject": "윤리"
      },
      {
        "period": 7,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": true,
        "originalSubject": "논술"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "생환",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "수과",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "수사",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "윤리",
        "teacher": "김상",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "생환",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "수사",
        "teacher": "임재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "정치",
        "teacher": "김승",
        "isChanged": false
      }
    ]
  },
  "3-4": {
    "월": [
      {
        "period": 2,
        "subject": "환경",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "고수",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김중",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": true,
        "originalSubject": "환경"
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "기하"
      },
      {
        "period": 3,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "고수",
        "teacher": "전순",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 6,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": true,
        "originalSubject": "사문"
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": true,
        "originalSubject": "심영"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "고수",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김중",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "고수",
        "teacher": "전순",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      }
    ]
  },
  "3-5": {
    "월": [
      {
        "period": 2,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": true,
        "originalSubject": "디자"
      },
      {
        "period": 2,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 3,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "환경",
        "teacher": "이경",
        "isChanged": true,
        "originalSubject": "심영"
      },
      {
        "period": 6,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": true,
        "originalSubject": "환경"
      },
      {
        "period": 7,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": true,
        "originalSubject": "기하"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "심리",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심영",
        "teacher": "임남",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심국",
        "teacher": "최보",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "환경",
        "teacher": "이경",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      }
    ]
  },
  "3-6": {
    "월": [
      {
        "period": 2,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": true,
        "originalSubject": "체탐"
      },
      {
        "period": 2,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": true,
        "originalSubject": "물리2"
      },
      {
        "period": 3,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": true,
        "originalSubject": "지구2"
      },
      {
        "period": 6,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": true,
        "originalSubject": "심리"
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "심국"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      }
    ]
  },
  "3-7": {
    "월": [
      {
        "period": 2,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "고수",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 2,
        "subject": "고수",
        "teacher": "박종",
        "isChanged": true,
        "originalSubject": "체탐"
      },
      {
        "period": 3,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": true,
        "originalSubject": "환경"
      },
      {
        "period": 6,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": true,
        "originalSubject": "고수"
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": true,
        "originalSubject": "심영"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "고수",
        "teacher": "박종",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김형",
        "isChanged": false
      }
    ]
  },
  "3-8": {
    "월": [
      {
        "period": 2,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "생명2",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "고수",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "생명2",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "고수",
        "teacher": "송영",
        "isChanged": true,
        "originalSubject": "화학2"
      },
      {
        "period": 2,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": true,
        "originalSubject": "심영"
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": true,
        "originalSubject": "기하"
      },
      {
        "period": 6,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "디자"
      },
      {
        "period": 7,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": true,
        "originalSubject": "사문"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "고수",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "김민",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "환경",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "생명2",
        "teacher": "조수",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "고수",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "하재",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      }
    ]
  },
  "3-9": {
    "월": [
      {
        "period": 2,
        "subject": "환경",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "물리2",
        "teacher": "김민",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "환경",
        "teacher": "김영",
        "isChanged": true,
        "originalSubject": "지구2"
      },
      {
        "period": 2,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": true,
        "originalSubject": "심영"
      },
      {
        "period": 3,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": true,
        "originalSubject": "체탐"
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 7,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": true,
        "originalSubject": "물리2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "환경",
        "teacher": "김영",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "지구2",
        "teacher": "김병",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      }
    ]
  },
  "3-10": {
    "월": [
      {
        "period": 2,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "심영",
        "teacher": "김운",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심리",
        "teacher": "강대",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "생명2",
        "teacher": "조수",
        "isChanged": false
      }
    ],
    "화": [
      {
        "period": 1,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "생명2",
        "teacher": "조수",
        "isChanged": false
      }
    ],
    "수": [
      {
        "period": 1,
        "subject": "환경",
        "teacher": "유의",
        "isChanged": true,
        "originalSubject": "사문"
      },
      {
        "period": 2,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": true,
        "originalSubject": "심국"
      },
      {
        "period": 3,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": true,
        "originalSubject": "창체"
      },
      {
        "period": 5,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": true,
        "originalSubject": "심영"
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": true,
        "originalSubject": "고수"
      },
      {
        "period": 7,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": true,
        "originalSubject": "생명2"
      }
    ],
    "목": [
      {
        "period": 1,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "심영",
        "teacher": "박미",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "진로",
        "teacher": "진*",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "특색",
        "teacher": "조수",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "환경",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "화학2",
        "teacher": "서준",
        "isChanged": false
      }
    ],
    "금": [
      {
        "period": 1,
        "subject": "환경",
        "teacher": "유의",
        "isChanged": false
      },
      {
        "period": 2,
        "subject": "사문",
        "teacher": "김승",
        "isChanged": false
      },
      {
        "period": 3,
        "subject": "디자",
        "teacher": "여연",
        "isChanged": false
      },
      {
        "period": 4,
        "subject": "기하",
        "teacher": "송영",
        "isChanged": false
      },
      {
        "period": 5,
        "subject": "체탐",
        "teacher": "이규",
        "isChanged": false
      },
      {
        "period": 6,
        "subject": "심국",
        "teacher": "이승",
        "isChanged": false
      },
      {
        "period": 7,
        "subject": "고수",
        "teacher": "김효",
        "isChanged": false
      }
    ]
  }
};

export const SEODAEJEON_ALL_CLASSES_TIMETABLE: Record<
  string,
  Record<"월" | "화" | "수" | "목" | "금", StaticPeriodEntry[]>
> = SEODAEJEON_MASTER_TIMETABLE;

