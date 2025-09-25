# DevReview

> 개발자 포트폴리오 리뷰 플랫폼

개발자들이 포트폴리오에 대한 피드백을 주고받을 수 있는 웹 플랫폼입니다. Next.js 14와 TypeScript로 구축된 프론트엔드 애플리케이션입니다.

## ✨ 주요 기능

- 포트폴리오 업로드 및 공유
- 개발자간 피드백 시스템
- 기술 스택별 필터링
- 소셜 로그인 (Google)
- 반응형 웹 디자인

## 🛠️ 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Context + Hooks
- JWT Authentication
- Lucide React Icons

## 📂 프로젝트 구조

```
src/
├── app/                   # Next.js App Router 페이지
│   ├── api/               # 백엔드 API를 호출하는 Route Handlers
│   ├── auth/              # 인증 관련 페이지 (콜백, 에러)
│   ├── login/             # 로그인 페이지
│   ├── portfolio/         # 포트폴리오 생성, 조회, 수정 페이지
│   ├── layout.tsx         # 전역 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # 재사용 가능한 UI 컴포넌트
├── hooks/                 # 커스텀 훅 (e.g., useAuth)
├── lib/                   # 유틸리티 및 API 통신 관련 함수
└── types/                 # TypeScript 타입 정의
```

## 🚀 시작하기

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/HomerSim/devreview.git
cd devreview
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.
```env
NEXT_PUBLIC_API_URL=your-backend-api-url
API_KEY = your-backend-frontend-api-key-here
```

4. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## � 주의사항

이 프로젝트는 **학습/데모 목적**으로 제작되었습니다.
- 실제 운영 환경에서 사용 시 보안 검토가 필요합니다
- 환경 변수 파일(`.env.local`)은 절대 공개하지 마세요
- OAuth 클라이언트 정보는 안전하게 관리하세요

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 참고 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)