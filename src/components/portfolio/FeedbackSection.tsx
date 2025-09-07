'use client';

import { useState, useEffect } from 'react';
import { Send, Star, ThumbsUp } from 'lucide-react';
import { Feedback, FeedbackResponse } from '@/types/portfolio';
import { formatRelativeTime } from '@/lib/utils/date';
import { useAuth } from '@/hooks/useAuth';
import { LoginPrompt } from '@/components/auth/LoginPrompt';

interface FeedbackSectionProps {
  portfolioId: string;
}

export function FeedbackSection({ portfolioId }: FeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated } = useAuth();
  
  // 🎯 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const ITEMS_PER_PAGE = 5;

  const loadFeedbacks = async (page = 1, isAppend = false) => {
    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
      setFeedbacks([]); // 첫 로딩시 기존 데이터 클리어
    }
    
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/feedbacks?page=${page}&limit=${ITEMS_PER_PAGE}`);
      
      if (response.ok) {
        const data: FeedbackResponse = await response.json();
        console.log('🔍 Feedbacks Response:', data);
        
        if (data.data && data.data.length > 0) {
          if (isAppend) {
            // 더보기: 기존 데이터에 추가
            setFeedbacks(prev => [...prev, ...data.data]);
          } else {
            // 새로 로딩: 데이터 교체
            setFeedbacks(data.data);
          }
          
          // 페이징 정보 업데이트
          const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);
          setTotalPages(totalPages);
          setCurrentPage(page);
          setHasMoreData(page < totalPages);
        }
        
      } else {
        if (!isAppend) {
          // API 오류 시 빈 배열로 설정
          setFeedbacks([]);
          setHasMoreData(false);
        }
      }
    } catch (error) {
      console.error('❌ Error loading feedbacks:', error);
      if (!isAppend) {
        // 네트워크 오류 시 빈 배열로 설정
        setFeedbacks([]);
        setHasMoreData(false);
      }
    } finally {
      if (isAppend) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadFeedbacks(1, false); // 첫 페이지 로딩
  }, [portfolioId]);

  // 🎯 더보기 버튼 핸들러
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    loadFeedbacks(nextPage, true);
  };

  // 🎯 사용자 친화적 오류 메시지 변환
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getUserFriendlyError = (errorData: any, status: number): string => {
    // 400번대는 대부분 사용자 입력 문제이므로 메시지 표시
    if (status >= 400 && status < 500) {
      const message = errorData.detail || errorData.error || '';
      
      // 알려진 비즈니스 오류들
      const businessErrors: { [key: string]: string } = {
        "Cannot create feedback on your own portfolio": "자신의 포트폴리오에는 피드백을 작성할 수 없습니다.",
        "You have already rated this portfolio": "이미 이 포트폴리오를 평가하셨습니다.",
        "Portfolio not found": "포트폴리오를 찾을 수 없습니다.",
        "Invalid rating value": "평점은 1-5 사이의 값이어야 합니다.",
        "Content too long": "피드백 내용이 너무 깁니다. (최대 500자)",
        "Authentication required": "로그인이 필요합니다."
      };
      
      return businessErrors[message] || "입력 정보를 확인해주세요.";
    }
    
    // 500번대 서버 오류는 일반적인 메시지
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  };

  const handleSubmitFeedback = async () => {
    if (!isAuthenticated || !newFeedback.trim() || rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🍪 쿠키 포함
        body: JSON.stringify({
          content: newFeedback,
          rating: rating
        }),
      });

      if (response.ok) {
        // 🎯 등록 성공 후 첫 페이지부터 다시 로딩
        await loadFeedbacks(1, false);
        
        setNewFeedback('');
        setRating(0);
        setErrorMessage(''); // 기존 에러 메시지 클리어
        setSuccessMessage('피드백이 성공적으로 등록되었습니다! 💬');
        
        // 3초 후 성공 메시지 자동 사라짐
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({})); // JSON 파싱 실패 대비
        console.error(`❌ API Error [${response.status}]:`, errorData);
        
        // ✅ 비즈니스 로직 오류는 사용자에게 표시
        const userMessage = getUserFriendlyError(errorData, response.status);
        setSuccessMessage(''); // 기존 성공 메시지 클리어
        setErrorMessage(userMessage);
        
        // 5초 후 에러 메시지 자동 사라짐
        setTimeout(() => setErrorMessage(''), 5000);
      }

    } catch (error) {
      console.error('❌ Network error submitting feedback:', error);
      // ❌ 시스템 오류는 일반적인 메시지로
      setSuccessMessage(''); // 기존 성공 메시지 클리어
      setErrorMessage('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
      
      // 5초 후 에러 메시지 자동 사라짐
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <FeedbackSkeleton />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* 피드백 작성 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">피드백 작성</h3>
        
        {!isAuthenticated ? (
          // 🔐 로그인하지 않은 사용자를 위한 UI
          <div className="text-center py-8">
            <LoginPrompt 
              message="피드백을 작성하려면 로그인이 필요합니다" 
              action="로그인하고 피드백 작성하기"
            />
          </div>
        ) : (
          // ✅ 로그인한 사용자를 위한 폼
          <>
            {/* 🎯 성공/에러 메시지 표시 영역 */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">{successMessage}</span>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-700 text-sm font-medium">{errorMessage}</span>
                <button 
                  onClick={() => setErrorMessage('')}
                  className="ml-auto text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

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
                      disabled={isSubmitting}
                      className="focus:outline-none disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-200'
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
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base disabled:bg-gray-100"
                  placeholder="건설적인 피드백을 작성해주세요..."
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                disabled={!newFeedback.trim() || rating === 0 || isSubmitting}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? '등록 중...' : '피드백 등록'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* 피드백 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          피드백 ({feedbacks.length})
        </h3>
        
        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <FeedbackCard 
                key={feedback.id || `feedback-${index}`} 
                feedback={feedback} 
              />
            ))}
            
            {/* 🎯 더보기 버튼 */}
            {hasMoreData && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingMore ? '로딩 중...' : `더보기 (${currentPage}/${totalPages})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">아직 피드백이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">첫 번째 피드백을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  // 안전한 기본값 설정 - 사용자가 삭제된 경우 처리
  const user = feedback.user || { name: '탈퇴한 사용자', role: null };
  const likeCount = feedback.like_count || 0;
  const rating = feedback.rating || 0;

  return (
    <div className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm sm:text-base">
            {user?.name || '탈퇴한 사용자'}
          </span>
          {user?.role === 'SENIOR' && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              시니어
            </span>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: rating }, (_, i) => (
              <Star key={`${feedback.id}-star-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
          <span>{formatRelativeTime(feedback.created_at)}</span>
          {/* <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likeCount}</span>
          </div> */}
        </div>
      </div>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        {feedback.content}
      </p>
    </div>
  );
}

function FeedbackSkeleton() {
  return (
    <div className="space-y-6">
      {/* 피드백 작성 스켈레톤 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-12"></div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-6 h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
            <div className="w-full h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* 피드백 목록 스켈레톤 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="h-6 bg-gray-200 rounded mb-4 w-24"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
