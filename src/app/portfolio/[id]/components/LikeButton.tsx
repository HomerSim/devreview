'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { usePortfolioLike, usePortfolioStore } from '@/stores/portfolioStore';

interface LikeButtonProps {
  portfolioId: string;
  initialLikeCount: number;
  initialIsLiked?: boolean; // 현재 사용자의 좋아요 상태
}

export function LikeButton({ portfolioId, initialLikeCount, initialIsLiked = false }: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // 🎯 Zustand에서 상태 가져오기
  const { likeCount, isLiked } = usePortfolioLike(portfolioId);
  
  // 🎯 개별 액션들을 직접 가져오기 (객체 생성 방지)
  const initializePortfolio = usePortfolioStore((state) => state.initializePortfolio);
  const updateLikeStatus = usePortfolioStore((state) => state.updateLikeStatus);
  
  // 🎯 컴포넌트 마운트 시 초기 데이터로 스토어 초기화
  useEffect(() => {
    initializePortfolio(portfolioId, initialLikeCount, initialIsLiked);
  }, [portfolioId, initialLikeCount, initialIsLiked, initializePortfolio]);

  const handleLike = async () => {
    if (isLoading) return;
    
    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;

    // 🎯 Optimistic UI: Zustand 스토어에서 즉시 상태 변경
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    updateLikeStatus(portfolioId, newLikeCount, newIsLiked);
    setIsLoading(true);

    try {
      const method = newIsLiked ? 'POST' : 'DELETE';
      const apiUrl = `/api/portfolios/${portfolioId}/like`;
      
      // 🔍 요청 정보 로깅
      console.log('🚀 Sending like request (Zustand):', {
        method,
        url: apiUrl,
        portfolioId,
        newIsLiked,
        newLikeCount,
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Like action success (Zustand):', data);
        console.log('🔍 Server response data:', {
          like_count: data.like_count,
          is_liked: data.is_liked,
          hasIsLiked: 'is_liked' in data,
          currentIsLiked: isLiked,
          expectedIsLiked: newIsLiked
        });
        
        // 🎯 서버에서 받은 정확한 좋아요 수로 Zustand 업데이트
        if (data.like_count !== undefined) {
          updateLikeStatus(portfolioId, data.like_count, data.is_liked !== undefined ? data.is_liked : newIsLiked);
        }
        
        console.log('✅ Zustand 상태 업데이트 완료');
      } else {
        // 🔍 더 자세한 에러 정보 로깅
        console.error('❌ Like action failed - Status:', response.status);
        console.error('❌ Like action failed - Status Text:', response.statusText);
        console.error('❌ Like action failed - URL:', response.url);
        
        const errorData = await response.json().catch((parseError) => {
          console.error('❌ Error parsing response JSON:', parseError);
          return { error: 'Failed to parse error response' };
        });
        console.error('❌ Like action failed - Error Data:', errorData);
        
        // 실패 시 원래 상태로 복원 (Zustand)
        console.log('❌ API 실패 - Zustand 상태 롤백:', {
          from: { isLiked: isLiked, likeCount: likeCount },
          to: { isLiked: originalIsLiked, likeCount: originalLikeCount }
        });
        updateLikeStatus(portfolioId, originalLikeCount, originalIsLiked);
        
        if (response.status === 401) {
          alert('로그인이 필요합니다.');
        } else if (response.status === 404) {
          alert('포트폴리오를 찾을 수 없습니다.');
        } else {
          const message = errorData.error || errorData.detail || '좋아요 처리 중 오류가 발생했습니다.';
          alert(`오류 (${response.status}): ${message}`);
        }
      }
    } catch (error) {
      console.error('❌ Network error details:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        portfolioId,
        timestamp: new Date().toISOString()
      });
      
      // 실패 시 원래 상태로 복원 (Zustand)
      console.log('❌ 네트워크 에러 - Zustand 상태 롤백:', {
        from: { isLiked: isLiked, likeCount: likeCount },
        to: { isLiked: originalIsLiked, likeCount: originalLikeCount }
      });
      updateLikeStatus(portfolioId, originalLikeCount, originalIsLiked);
      
      if (error instanceof Error) {
        alert(`네트워크 오류: ${error.message}`);
      } else {
        alert('알 수 없는 네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 ${
        isLiked
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} />
      {isLoading ? '처리 중...' : (isLiked ? '좋아요 취소' : '좋아요')} ({likeCount})
    </button>
  );
}
