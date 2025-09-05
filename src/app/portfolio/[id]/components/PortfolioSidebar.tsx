'use client';

import { useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePortfolioLike, usePortfolioStore } from '@/stores/portfolioStore';
import { LikeButton } from './LikeButton';
import { PortfolioDetail } from '@/types/portfolio';

interface PortfolioSidebarProps {
  portfolio: PortfolioDetail;
}

export function PortfolioSidebar({ portfolio }: PortfolioSidebarProps) {
  // 🎯 Zustand에서 실시간 좋아요 상태 가져오기
  const { likeCount, isLiked } = usePortfolioLike(portfolio.id);
  
  // 🎯 개별 액션을 직접 가져오기 (객체 생성 방지)
  const initializePortfolio = usePortfolioStore((state) => state.initializePortfolio);
  
  // 🎯 컴포넌트 마운트 시 초기 데이터로 스토어 초기화
  useEffect(() => {
    initializePortfolio(portfolio.id, portfolio.like_count, portfolio.is_liked || false);
  }, [portfolio.id, portfolio.like_count, portfolio.is_liked, initializePortfolio]);

  console.log('🎯 PortfolioSidebar 렌더링 (Zustand):', {
    portfolioId: portfolio.id,
    zustandLikeCount: likeCount,
    zustandIsLiked: isLiked,
    initialLikeCount: portfolio.like_count,
    initialIsLiked: portfolio.is_liked,
  });

  return (
    <div className="space-y-6">
      {/* 통계 - 실시간 Zustand 상태 반영 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">통계</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 text-sm sm:text-base">조회수</span>
            </div>
            <span className="font-semibold">{portfolio.view_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              <span className="text-gray-600 text-sm sm:text-base">좋아요</span>
            </div>
            {/* 🎯 Zustand에서 실시간 업데이트되는 좋아요 수 */}
            <span className="font-semibold transition-colors duration-200">{likeCount}</span>
          </div>
        </div>
        
        {/* 🎯 좋아요 버튼 - Zustand로 상태 공유 */}
        <LikeButton 
          portfolioId={portfolio.id} 
          initialLikeCount={portfolio.like_count}
          initialIsLiked={portfolio.is_liked || false}
        />
      </div>

      {/* 관련 프로젝트 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">관련 프로젝트</h3>
        <div className="space-y-3">
          <Link href="/portfolio/sample-2" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              AI 기반 이미지 분류 앱
            </h4>
            <p className="text-xs sm:text-sm text-gray-600">
              TensorFlow를 활용한 실시간 이미지 인식 모바일 앱
            </p>
          </Link>
          <Link href="/portfolio/sample-3" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              MSA 기반 배송 관리 시스템
            </h4>
            <p className="text-xs sm:text-sm text-gray-600">
              마이크로서비스 아키텍처로 구현한 물류 관리 시스템
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
