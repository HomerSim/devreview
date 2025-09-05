import { ArrowLeft, ExternalLink, Github, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { PortfolioDetail } from '@/types/portfolio';
import { formatDate, formatRelativeTime } from '@/lib/utils/date';
import { FeedbackSection } from '@/components/portfolio/FeedbackSection';
import { PortfolioSidebar } from './components/PortfolioSidebar';

interface Props {
  params: Promise<{ id: string }>;
}

// 샘플 포트폴리오 데이터 (API 실패 시 사용)
const SAMPLE_PORTFOLIO: PortfolioDetail = {
  id: "sample-1",
  title: 'E-커머스 풀스택 웹사이트',
  description: 'React와 Node.js로 만든 온라인 쇼핑몰입니다',
  content: `## 프로젝트 소개
현대적인 E-커머스 플랫폼을 구축하여 사용자가 편리하게 상품을 검색하고 구매할 수 있는 온라인 쇼핑몰을 개발했습니다.

## 주요 기능
- **사용자 인증**: JWT 기반 회원가입/로그인
- **상품 관리**: 카테고리별 상품 분류 및 검색
- **장바구니**: 실시간 장바구니 업데이트
- **결제 시스템**: 다양한 결제 방식 지원
- **주문 관리**: 주문 내역 및 배송 추적

## 기술적 도전과제
1. **성능 최적화**: React.memo와 useMemo를 활용한 렌더링 최적화
2. **상태 관리**: Redux Toolkit을 통한 복잡한 상태 관리
3. **SEO 최적화**: Next.js의 SSR/ISR을 활용한 검색 엔진 최적화
4. **보안**: XSS, CSRF 공격 방지를 위한 보안 조치

## 학습한 내용
이 프로젝트를 통해 풀스택 웹 개발의 전반적인 과정을 경험했습니다. 특히 사용자 경험을 고려한 UI/UX 설계와 확장 가능한 백엔드 아키텍처 구성에 대해 깊이 있게 학습할 수 있었습니다.`,
  
  tech_stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Next.js', 'Tailwind CSS'],
  github_url: 'https://github.com/user/ecommerce-project',
  deploy_url: 'https://ecommerce-demo.vercel.app',
  view_count: 247,
  like_count: 15,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-20T14:22:00Z',
  user: {
    id: 'user1',
    name: '김개발',
  }
};

// 🎯 서버 사이드에서 포트폴리오 데이터를 가져오는 함수
async function getPortfolio(id: string): Promise<PortfolioDetail | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": `${process.env.API_KEY}`,
            // 🚨 캐시 무효화 - 항상 최신 데이터
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
        cache: 'no-store', // Next.js 캐시 사용 안함
    });

    if (!response.ok) {
      console.log('API 실패, 샘플 데이터 사용');
      return SAMPLE_PORTFOLIO;
    }

    const data = await response.json();
    
    // 🔍 서버에서 받은 데이터 로깅
    console.log('📡 포트폴리오 상세 데이터:', {
      id: data.data?.id,
      like_count: data.data?.like_count,
      is_liked: data.data?.is_liked,
      hasIsLiked: 'is_liked' in (data.data || {}),
    });
    
    return data.data;
  } catch (error) {
    console.error('포트폴리오 조회 에러:', error);
    return SAMPLE_PORTFOLIO; // API 실패 시 샘플 데이터 반환
  }
}

// 🎯 메인 컴포넌트 (기본 export) - 이게 중요!
export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                <span className="hidden sm:inline">포트폴리오 상세</span>
                <span className="sm:hidden">상세</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* 포트폴리오 정보 */}
            <PortfolioHeader portfolio={portfolio} />

            {/* 상세 설명 */}
            <PortfolioContent content={portfolio.content} />

            {/* 🎯 피드백은 클라이언트 컴포넌트로 분리 (인터랙티브) */}
            <FeedbackSection portfolioId={portfolio.id} />
          </div>

          {/* 사이드바 - Zustand로 실시간 좋아요 수 공유 */}
          <PortfolioSidebar portfolio={portfolio} />
        </div>
      </main>
    </div>
  );
}

// 🎯 포트폴리오 헤더 컴포넌트
function PortfolioHeader({ portfolio }: { portfolio: PortfolioDetail }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {portfolio.title}
        </h1>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {portfolio.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
          <span>작성자: {portfolio.user.name}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatDate(portfolio.created_at)}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatRelativeTime(portfolio.created_at)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {portfolio.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-50 text-blue-500 text-xs sm:text-sm rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <a
            href={portfolio.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          {portfolio.deploy_url && (
            <a
              href={portfolio.deploy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <ExternalLink className="w-4 h-4" />
              라이브 데모
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎯 포트폴리오 콘텐츠 컴포넌트
function PortfolioContent({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        프로젝트 상세 설명
      </h2>
      <div className="prose max-w-none text-sm sm:text-base prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
