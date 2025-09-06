import { useState, useEffect } from 'react';
import { UserProfile, UserProfileApiResponse, UserPortfolio, UserPortfoliosApiResponse } from '@/types/user';

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [portfolios, setPortfolios] = useState<UserPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 백엔드 사용자 API 응답을 프론트엔드 타입으로 변환
  const transformUserData = (apiData: UserProfileApiResponse['data']): UserProfile => {
    return {
      id: apiData.id,
      email: apiData.email,
      name: apiData.name,
      role: apiData.role,
      image: apiData.image,
      isVerified: apiData.is_verified,
      joinedAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      portfolioCount: apiData.portfolio_count,
      totalFeedbackReceived: apiData.received_feedback_count,
      totalLikes: apiData.received_like_count
    };
  };

  // 🎯 백엔드 포트폴리오 API 응답을 프론트엔드 타입으로 변환
  const transformPortfoliosData = (apiData: UserPortfoliosApiResponse['data']): UserPortfolio[] => {
    return apiData.map(portfolio => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      techStack: portfolio.tech_stack,
      githubUrl: portfolio.github_url,
      deployUrl: portfolio.deploy_url,
      viewCount: portfolio.view_count,
      likeCount: portfolio.like_count,
      feedbackCount: portfolio.feedback_count, // 피드백 개수 추가
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
      status: 'published' as const // 백엔드에서 받아온 데이터는 모두 게시됨 상태
    }));
  };

  // 🎯 사용자 프로필 조회
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse: UserProfileApiResponse = await response.json();
      
      console.log('🔍 User Profile API Response:', apiResponse);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to fetch user profile');
      }

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const userData = transformUserData(apiResponse.data);
      setUser(userData);
      
    } catch (err) {
      console.error('❌ User profile error:', err);
      throw err; // 상위에서 처리하도록 에러 전파
    }
  };

  // 🎯 사용자 포트폴리오 목록 조회
  const fetchUserPortfolios = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/users/me/portfolios', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse: UserPortfoliosApiResponse = await response.json();
      
      console.log('🔍 User Portfolios API Response:', apiResponse);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to fetch user portfolios');
      }

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const portfoliosData = transformPortfoliosData(apiResponse.data);
      setPortfolios(portfoliosData);
      
    } catch (err) {
      console.error('❌ User portfolios error:', err);
      throw err; // 상위에서 처리하도록 에러 전파
    }
  };

  // 🎯 역할 변경 (시니어 인증)
  const handleRoleSwitch = async () => {
    if (user?.role === 'JUNIOR') {
      // 시니어 인증 페이지로 이동
      window.location.href = '/senior/verify';
    } else {
      // 주니어로 전환하는 API 호출 (구현 필요)
      console.log('Switch to JUNIOR role');
      // TODO: 역할 변경 API 구현
    }
  };

  // 🎯 초기 데이터 로드 (병렬 처리)
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 사용자 프로필과 포트폴리오를 병렬로 로딩
        await Promise.all([
          fetchUserProfile(),
          fetchUserPortfolios()
        ]);

      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 🎯 포트폴리오 삭제
  const deletePortfolio = async (portfolioId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '포트폴리오 삭제에 실패했습니다.');
      }

      // 삭제 성공 시 로컬 상태에서도 제거
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
      
      // 사용자 프로필의 포트폴리오 개수 업데이트
      if (user) {
        setUser(prev => prev ? {
          ...prev,
          portfolioCount: Math.max(0, prev.portfolioCount - 1)
        } : null);
      }

      return true;
    } catch (err) {
      console.error('❌ Delete portfolio error:', err);
      throw err;
    }
  };

  return {
    user,
    portfolios,
    isLoading,
    error,
    refetchProfile: fetchUserProfile,
    refetchPortfolios: fetchUserPortfolios,
    deletePortfolio,
    handleRoleSwitch,
  };
};
