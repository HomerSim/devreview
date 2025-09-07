'use client';

import { useEffect, useMemo } from 'react';
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePortfolioLike, usePortfolioStore } from '@/stores/portfolioStore';
import { LikeButton } from './LikeButton';
import { PortfolioDetail } from '@/types/portfolio';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioSidebarProps {
  portfolio: PortfolioDetail;
  onDeleteClick?: (portfolioId: string, portfolioTitle: string, feedbackCount: number) => void;
}

export function PortfolioSidebar({ portfolio, onDeleteClick }: PortfolioSidebarProps) {
  // 🎯 Zustand에서 실시간 좋아요 상태 가져오기
  const { likeCount, isLiked } = usePortfolioLike(portfolio.id);
  
  // 🎯 개별 액션을 직접 가져오기 (객체 생성 방지)
  const initializePortfolio = usePortfolioStore((state) => state.initializePortfolio);
  
  // 🔐 현재 사용자 정보
  const { user, isAuthenticated } = useAuth();
  
  // 🔒 백엔드에서 검증된 소유자 여부 사용 (보안)
  const isOwner = useMemo(() => {
    // 백엔드에서 제공하는 is_owner 필드 사용
    // true: 로그인 사용자 === 포트폴리오 작성자
    // false: 다른 사용자 (로그인했지만 소유자가 아님)  
    // null: 로그인하지 않은 사용자
    return portfolio.is_owner === true;
  }, [portfolio.is_owner]);

  // 🔍 디버깅용 로그 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 PortfolioSidebar Debug:', {
        'portfolio.is_owner': portfolio.is_owner,
        'calculated isOwner': isOwner,
        'isAuthenticated': isAuthenticated,
        'user?.id': user?.id,
      });
    }
  }, [portfolio.is_owner, isOwner, isAuthenticated, user]);
  
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

      {/* 🔒 소유자 전용 관리 메뉴 (백엔드 검증) */}
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
                if (onDeleteClick) {
                  // 포트폴리오에서 피드백 수를 가져오거나 0으로 기본값 설정
                  const feedbackCount = portfolio.feedback_count || 0;
                  onDeleteClick(portfolio.id, portfolio.title, feedbackCount);
                } else {
                  // 기존 로직 (fallback)
                  if (window.confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
                    console.log('포트폴리오 삭제:', portfolio.id);
                    alert('삭제 기능은 추후 구현 예정입니다.');
                  }
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
