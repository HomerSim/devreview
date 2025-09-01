'use client';

import { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Heart, MessageCircle, Send, Star, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// 샘플 데이터
const SAMPLE_PORTFOLIO = {
  id: 1,
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
  author: 'Anonymous_Dev_01',
  techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Redis', 'JWT'],
  githubUrl: 'https://github.com/example/ecommerce-project',
  deployUrl: 'https://ecommerce-demo.vercel.app',
  createdAt: '2024-08-15',
  feedbackCount: 12,
  likes: 28
};

const SAMPLE_FEEDBACKS = [
  {
    id: 1,
    author: 'Senior_Dev_A',
    content: '전반적으로 잘 구현된 프로젝트입니다. 특히 동시성 문제를 Redis 분산 락으로 해결한 부분이 인상적입니다. 다만 에러 핸들링 부분을 더 체계적으로 구현하면 좋을 것 같습니다.',
    likes: 15,
    createdAt: '2024-08-16',
    verified: true
  },
  {
    id: 2,
    author: 'Senior_Dev_B',
    content: '코드 구조가 깔끔하고 README 문서도 잘 작성되어 있네요. 테스트 코드를 추가하고 CI/CD 파이프라인을 구축하면 더욱 완성도 높은 프로젝트가 될 것 같습니다.',
    likes: 8,
    createdAt: '2024-08-17',
    verified: true
  },
  {
    id: 3,
    author: 'Senior_Dev_C',
    content: '성능 최적화를 위한 무한 스크롤 구현이 좋습니다. 다음에는 PWA 기능을 추가해보시거나, 마이크로서비스 아키텍처로 확장해보는 것을 추천드립니다.',
    likes: 12,
    createdAt: '2024-08-18',
    verified: true
  }
];

export default function PortfolioDetailPage() {
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState(SAMPLE_FEEDBACKS);

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim()) return;
    
    const feedback = {
      id: feedbacks.length + 1,
      author: 'Senior_Dev_New',
      content: newFeedback,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      verified: true
    };
    
    setFeedbacks([...feedbacks, feedback]);
    setNewFeedback('');
  };

  const handleLikeFeedback = (feedbackId: number) => {
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, likes: feedback.likes + 1 }
        : feedback
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                포트폴리오 상세
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 포트폴리오 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {SAMPLE_PORTFOLIO.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  {SAMPLE_PORTFOLIO.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>작성자: {SAMPLE_PORTFOLIO.author}</span>
                  <span>•</span>
                  <span>{SAMPLE_PORTFOLIO.createdAt}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {SAMPLE_PORTFOLIO.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-50 text-blue-500 text-sm rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={SAMPLE_PORTFOLIO.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  {SAMPLE_PORTFOLIO.deployUrl && (
                    <a
                      href={SAMPLE_PORTFOLIO.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      라이브 데모
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                프로젝트 상세 설명
              </h2>
              <div className="prose max-w-none">
                <ReactMarkdown>{SAMPLE_PORTFOLIO.content}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 통계 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">통계</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">피드백</span>
                  </div>
                  <span className="font-semibold">{SAMPLE_PORTFOLIO.feedbackCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">좋아요</span>
                  </div>
                  <span className="font-semibold">{SAMPLE_PORTFOLIO.likes}</span>
                </div>
              </div>
            </div>

            {/* 피드백 작성 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                피드백 남기기
              </h3>
              <div className="space-y-4">
                <textarea
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  placeholder="건설적인 피드백을 남겨주세요..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubmitFeedback}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  피드백 남기기
                </button>
              </div>
            </div>

            {/* 피드백 목록 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                받은 피드백 ({feedbacks.length})
              </h3>
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {feedback.author}
                      </span>
                      {feedback.verified && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <span className="text-sm text-gray-500">
                        {feedback.createdAt}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {feedback.content}
                    </p>
                    <button
                      onClick={() => handleLikeFeedback(feedback.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{feedback.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
