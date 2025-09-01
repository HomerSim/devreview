# DevReview - 포트폴리오 리뷰 플랫폼

"AI는 줄 수 없는, 시니어의 진짜 피드백으로 취업 관문을 뚫으세요"

DevReview는 주니어 개발자들이 시니어 개발자들로부터 포트폴리오에 대한 실무 중심의 피드백을 받을 수 있는 플랫폼입니다.

## 🚀 주요 기능

### 주니어 개발자를 위한 기능
- **포트폴리오 업로드**: GitHub URL, 배포 URL과 함께 프로젝트를 상세히 소개
- **실무 중심 피드백**: 현업 시니어 개발자들로부터 구체적인 개선점 제안
- **익명 시스템**: 부담 없는 환경에서 솔직한 피드백 교환
- **기술 스택별 필터링**: 관심 분야의 포트폴리오 및 피드백 확인

### 시니어 개발자를 위한 기능
- **포트폴리오 리뷰**: 주니어들의 프로젝트에 전문적인 피드백 제공
- **개발자 인증 시스템**: LinkedIn 프로필 및 재직증명서를 통한 신원 확인
- **멘토링 기여**: 개발 커뮤니티 성장에 기여

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js (GitHub, Google OAuth)
- **UI Components**: Lucide React Icons
- **Markdown**: React Markdown

## 📋 페이지 구조

1. **랜딩 페이지** (`/`) - 서비스 소개 및 OAuth 로그인
2. **역할 선택** (`/role-selection`) - 주니어/시니어 개발자 선택
3. **메인 피드** (`/feed`) - 포트폴리오 목록 및 필터링
4. **포트폴리오 생성** (`/portfolio/create`) - 포트폴리오 업로드
5. **포트폴리오 상세** (`/portfolio/[id]`) - 프로젝트 상세 정보 및 피드백
6. **시니어 인증** (`/senior/verify`) - 시니어 개발자 인증 신청
7. **마이페이지** (`/profile`) - 사용자 정보 및 활동 내역

## 🗄️ 데이터베이스 스키마

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      UserRole @default(JUNIOR)
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  portfolios Portfolio[]
  feedbacks  Feedback[]
}

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String
  githubUrl   String
  deployUrl   String?
  techStack   String[]
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  author    User       @relation(fields: [authorId], references: [id])
  feedbacks Feedback[]
}

model Feedback {
  id           String   @id @default(cuid())
  content      String
  likes        Int      @default(0)
  authorId     String
  portfolioId  String
  createdAt    DateTime @default(now())
  
  author    User      @relation(fields: [authorId], references: [id])
  portfolio Portfolio @relation(fields: [portfolioId], references: [id])
}

enum UserRole {
  JUNIOR
  SENIOR
}
```

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+ 
- PostgreSQL 데이터베이스
- GitHub/Google OAuth 앱 설정

### 설치 및 설정

1. **저장소 클론**
```bash
git clone https://github.com/your-username/devreview.git
cd devreview
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:
```env
# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/devreview"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth 설정
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **데이터베이스 마이그레이션**
```bash
npx prisma migrate dev
```

5. **개발 서버 실행**
```bash
npm run dev
```

서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 📝 주요 특징

### UI/UX 디자인
- **모던 그라데이션**: 블루에서 퍼플로 이어지는 아름다운 배경
- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- **직관적인 네비게이션**: 명확한 정보 구조와 사용자 플로우

### 개발자 경험
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **Tailwind CSS**: 빠른 스타일링과 일관된 디자인 시스템
- **Prisma ORM**: 타입 안전한 데이터베이스 액세스

### 보안 및 인증
- **OAuth 인증**: GitHub, Google 계정을 통한 안전한 로그인
- **시니어 인증**: LinkedIn 프로필과 재직증명서를 통한 검증
- **익명성 보장**: 안전한 피드백 환경 제공

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🔗 관련 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [NextAuth.js 문서](https://next-auth.js.org)
