# MSW Testing - React + TypeScript + MSW

이 프로젝트는 MSW(Mock Service Worker)를 활용하여 React + TypeScript 환경에서 API Mocking을 구현한 데모 프로젝트입니다.

## 🚀 주요 기능

- **사용자 관리**: 사용자 목록 조회, 생성, 삭제, 상세 정보 조회
- **게시물 목록**: 게시물 목록 조회 및 작성자 정보 연동
- **MSW API Mocking**: 실제 백엔드 API 없이도 프론트엔드 개발 가능
- **TypeScript**: 타입 안전성과 개발자 경험 향상
- **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **API Mocking**: MSW (Mock Service Worker) 2.x
- **Styling**: CSS3 (반응형 디자인)
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하면 애플리케이션을 확인할 수 있습니다.

### 3. 빌드
```bash
npm run build
```

### 4. 타입 체크
```bash
npm run type-check
```

## 🔧 MSW 설정

### 핸들러 정의
`src/mocks/handlers.ts`에서 API 엔드포인트별 Mock 응답을 정의합니다:

```typescript
export const getUsers = http.get('/api/users', () => {
  return HttpResponse.json([
    { id: 1, name: '김철수', email: 'kim@example.com', role: 'admin' },
    // ... 더 많은 사용자 데이터
  ])
})
```

### 브라우저 설정
`src/mocks/browser.ts`에서 MSW Worker를 설정합니다:

```typescript
export const worker = setupWorker(
  getUsers,
  getUserById,
  createUser,
  // ... 더 많은 핸들러
)
```

### 초기화
`src/mocks/index.ts`에서 개발 환경에서만 MSW를 활성화합니다:

```typescript
async function enableMocking() {
  if (process.env.NODE_ENV !== 'production') {
    const { worker } = await import('./browser')
    return worker.start()
  }
}
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── UserList.tsx    # 사용자 목록 컴포넌트
│   ├── UserList.css    # 사용자 목록 스타일
│   ├── PostList.tsx    # 게시물 목록 컴포넌트
│   └── PostList.css    # 게시물 목록 스타일
├── mocks/              # MSW 설정 및 핸들러
│   ├── handlers.ts     # API Mock 핸들러
│   ├── browser.ts      # 브라우저 MSW 설정
│   └── index.ts        # MSW 초기화
├── services/           # API 서비스 함수
│   └── api.ts         # 사용자 및 게시물 API
├── types/              # TypeScript 타입 정의
│   └── index.ts       # 인터페이스 및 타입
├── App.tsx             # 메인 App 컴포넌트
├── App.css             # App 스타일
├── index.tsx           # 애플리케이션 진입점
└── index.css           # 전역 스타일
```

## 🌐 Mock API 엔드포인트

### 사용자 관련 API
- `GET /api/users` - 사용자 목록 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

### 게시물 관련 API
- `GET /api/posts` - 게시물 목록 조회

## 🔍 개발자 도구 활용

### Network 탭 확인
브라우저 개발자 도구의 Network 탭에서 MSW가 가로챈 요청들을 확인할 수 있습니다:

1. 개발자 도구 열기 (F12)
2. Network 탭 선택
3. 애플리케이션에서 사용자 목록이나 게시물 목록 조회
4. `/api/users` 또는 `/api/posts` 요청이 MSW에 의해 처리되는 것 확인

### Console 로그
MSW Worker 시작 시 콘솔에 관련 로그가 출력됩니다.

## 📱 반응형 디자인

- **데스크톱**: 2열 그리드 레이아웃
- **태블릿/모바일**: 1열 레이아웃으로 자동 전환
- **네비게이션**: 모바일에서는 세로 탭 형태로 변경

## 🚀 확장 가능성

이 프로젝트는 다음과 같이 확장할 수 있습니다:

1. **더 많은 API 엔드포인트**: 새로운 Mock 핸들러 추가
2. **인증 시스템**: JWT 토큰 기반 인증 Mock 구현
3. **에러 처리**: 다양한 HTTP 상태 코드와 에러 응답 Mock
4. **테스트**: Jest + MSW를 활용한 컴포넌트 테스트
5. **상태 관리**: Redux Toolkit 또는 Zustand 추가

## 📚 참고 자료

- [MSW 공식 문서](https://mswjs.io/)
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)

## 🤝 기여하기

1. 이 저장소를 Fork
2. 새로운 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
