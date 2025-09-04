'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Github, Heart, MessageCircle, Send, Star, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { formatDate, formatRelativeTime } from '@/lib/utils/date';


interface PortfolioSummary {
  id: string;
  title: string;          // 카드 제목
  description: string;    // 카드 설명
  content: string;
  github_url: string;
  deploy_url: string;
  tech_stack: string[];   // 기술 스택 태그
  view_count: number;     // 조회수
  like_count: number;     // 좋아요 수
  created_at: string;
  user: {
    name: string;         // 작성자명
  };
}

// 샘플 데이터
const SAMPLE_PORTFOLIO: PortfolioSummary = {
  id: "1",
  title: 'E-커머스 풀스택 웹사이트',
  description: 'React와 Node.js로 만든 온라인 쇼핑몰입니다',
  content: `## 프로젝트 소개
현대적인 E-커머스 플랫폼을 구축하여 사용자가 편리하게 상품을 검색하고 구매할 수 있는 온라인 쇼핑몰을 개발했습니다.

## 주요 기능
- **상품 관리**: 관리자가 상품을 등록, 수정, 삭제할 수 있는 기능
- **장바구니**: 사용자가 원하는 상품을 담고 수량을 조절할 수 있는 기능  
- **결제 시스템**: 다양한 결제 수단을 지원하는 안전한 결제 시스템
- **주문 관리**: 주문 내역 조회 및 배송 상태 확인 기능
- **사용자 인증**: JWT를 활용한 로그인/회원가입 시스템

## 기술적 도전과 해결 과정
### 1. 실시간 재고 관리
여러 사용자가 동시에 같은 상품을 주문할 때 재고 부족 문제가 발생했습니다. 이를 해결하기 위해 Redis를 사용한 분산 락을 구현하여 동시성 문제를 해결했습니다.

### 2. 성능 최적화
초기에는 모든 상품 데이터를 한 번에 로딩하여 페이지 로딩 속도가 느렸습니다. React.lazy와 Intersection Observer API를 활용하여 무한 스크롤과 지연 로딩을 구현했습니다.

## 궁금한 점
- 대용량 트래픽을 처리하기 위한 아키텍처 설계 방법
- 더 효율적인 데이터베이스 최적화 전략
- 보안 강화를 위한 추가적인 방법들`,
  github_url: 'https://github.com/example/ecommerce-project',
  deploy_url: 'https://ecommerce-demo.vercel.app',
  tech_stack: ['React', 'Node.js', 'MongoDB', 'Express', 'Redis', 'JWT'],
  view_count: 145,
  like_count: 28,
  created_at: '2024-08-15',
  user: {
    name: 'Anonymous_Dev_01'
  }
};

const SAMPLE_FEEDBACKS = [
  {
    id: 1,
    author: 'Senior_Dev_A',
    content: '전반적으로 잘 구현된 프로젝트입니다. 특히 동시성 문제를 Redis 분산 락으로 해결한 부분이 인상적입니다. 다만 에러 핸들링 부분을 더 체계적으로 구현하면 좋을 것 같습니다.',
    likes: 15,
    createdAt: '2024-08-16T10:30:00.000Z',
    verified: true
  },
  {
    id: 2,
    author: 'Tech_Mentor_B',
    content: '코드 구조가 깔끔하고 주석도 잘 되어있네요. 테스트 코드 작성도 고려해보시면 더 완성도 높은 프로젝트가 될 것 같습니다.',
    likes: 8,
    createdAt: '2024-08-17T14:22:00.000Z',
    verified: true
  }
];

interface Props {
  params: { id: string };
}
export default function PortfolioDetailPage({ params }: Props) {

  const portfolioId = params.id;

  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [portfolio, setPortfolio] = useState<PortfolioSummary>();

  const handleSubmitFeedback = () => {
    if (newFeedback.trim()) {
      // TODO: API 연결
      console.log('Submit feedback:', { content: newFeedback, rating });
      setNewFeedback('');
      setRating(0);
    }
  };

   useEffect(() => {
      const fetchPortfolios = async () => {

        if (!portfolioId) return;

        try {
          setLoading(true);
          const response = await fetch(`/api/portfolios/${portfolioId}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('🔍 Full API Response:', data);
          console.log('📊 Portfolio Data:', data.data);
          console.log('📈 Total Count:', data.total);
          
          // ✅ 실제 포트폴리오 배열만 설정
          if (data.data) {
            setPortfolio(data.data); // 첫 번째 포트폴리오 사용
          } else {
            // API 데이터가 없으면 샘플 데이터 사용
            console.log('📝 Using sample data as fallback');
            setPortfolio(SAMPLE_PORTFOLIO);
          }
        } catch (error) {
          console.error('❌ Error fetching portfolios:', error);
          console.log('📝 Using sample data as fallback');
          // 오류 발생 시 샘플 데이터 사용
          setPortfolio(SAMPLE_PORTFOLIO);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPortfolios();
    }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">포트폴리오를 찾을 수 없습니다</h1>
          <Link href="/feed" className="text-blue-500 hover:text-blue-600">
            피드로 돌아가기
          </Link>
        </div>
      </div>
    );
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {portfolio?.title}
                </h1>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {portfolio?.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
                  <span>작성자: {portfolio?.user?.name}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{portfolio?.created_at ? formatDate(portfolio.created_at) : ''}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{portfolio?.created_at ? formatRelativeTime(portfolio.created_at) : ''}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {portfolio?.tech_stack?.map((tech) => (
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
                    href={portfolio?.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  {portfolio?.deploy_url && (
                    <a
                      href={portfolio?.deploy_url}
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

            {/* 상세 설명 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                프로젝트 상세 설명
              </h2>
              <div className="prose max-w-none text-sm sm:text-base">
                <ReactMarkdown>{portfolio?.content}</ReactMarkdown>
              </div>
            </div>

            {/* 피드백 작성 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">피드백 작성</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    피드백 내용
                  </label>
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="건설적인 피드백을 작성해주세요..."
                  />
                </div>

                <button
                  onClick={handleSubmitFeedback}
                  disabled={!newFeedback.trim() || rating === 0}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Send className="w-4 h-4" />
                  피드백 등록
                </button>
              </div>
            </div>

            {/* 피드백 목록 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                피드백 ({SAMPLE_FEEDBACKS.length})
              </h3>
              
              <div className="space-y-4">
                {SAMPLE_FEEDBACKS.map((feedback) => (
                  <div key={feedback.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {feedback.author}
                        </span>
                        {feedback.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            시니어
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <span>{formatRelativeTime(feedback.createdAt)}</span>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{feedback.likes}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{feedback.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 통계 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">통계</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm sm:text-base">피드백</span>
                  </div>
                  <span className="font-semibold">{SAMPLE_FEEDBACKS.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 text-sm sm:text-base">좋아요</span>
                  </div>
                  <span className="font-semibold">{portfolio?.like_count || 0}</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? '좋아요 취소' : '좋아요'}
              </button>
            </div>

            {/* 관련 프로젝트 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 프로젝트</h3>
              <div className="space-y-3">
                <Link href="/portfolio/2" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                    Todo App with TypeScript
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    React와 TypeScript로 만든 할 일 관리 앱
                  </p>
                </Link>
                <Link href="/portfolio/3" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                    날씨 앱
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    OpenWeather API를 활용한 날씨 정보 앱
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
