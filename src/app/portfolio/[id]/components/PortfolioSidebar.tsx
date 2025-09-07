'use client';

import { useEffect } from 'react';
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePortfolioLike, usePortfolioStore } from '@/stores/portfolioStore';
import { LikeButton } from './LikeButton';
import { PortfolioDetail } from '@/types/portfolio';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioSidebarProps {
  portfolio: PortfolioDetail;
}

export function PortfolioSidebar({ portfolio }: PortfolioSidebarProps) {
  // 🎯 Zustand에서 실시간 좋아요 상태 가져오기
  const { likeCount, isLiked } = usePortfolioLike(portfolio.id);
  
  // 🎯 개별 액션을 직접 가져오기 (객체 생성 방지)
  const initializePortfolio = usePortfolioStore((state) => state.initializePortfolio);
  
  // 🔐 현재 사용자 정보
  const { user, isAuthenticated } = useAuth();
  
  // 🔒 소유자인지 확인 (두 가지 방법으로 체크)
  const isOwner = isAuthenticated && user && (
    portfolio.user_id === user.id || // API에서 user_id가 있는 경우
    (portfolio.user && portfolio.user.id === user.id) // user 객체 안의 id로 확인
  );
  
  // 🎯 컴포넌트 마운트 시 초기 데이터로 스토어 초기화
  useEffect(() => {
    initializePortfolio(portfolio.id, portfolio.like_count, portfolio.is_liked || false);
  }, [portfolio.id, portfolio.like_count, portfolio.is_liked, initializePortfolio]);

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

      {/* 🔒 소유자 전용 관리 메뉴 */}
      {isOwner && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">관리</h3>
          <div className="space-y-3">
            <Link
              href={`/portfolio/edit/${portfolio.id}`}
              className="flex items-center gap-3 w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <Edit className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <span className="text-blue-700 font-medium group-hover:text-blue-800">
                포트폴리오 수정
              </span>
            </Link>
            
            <button
              onClick={() => {
                if (window.confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
                  // TODO: 삭제 기능 구현
                  console.log('포트폴리오 삭제:', portfolio.id);
                  alert('삭제 기능은 추후 구현 예정입니다.');
                }
              }}
              className="flex items-center gap-3 w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-700" />
              <span className="text-red-700 font-medium group-hover:text-red-800">
                포트폴리오 삭제
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
