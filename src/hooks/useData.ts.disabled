'use client';

import { useState, useEffect } from 'react';
import { Portfolio, Feedback, PaginatedResponse } from '@/types/api';
import { apiClient } from '@/lib/api';

// 포트폴리오 목록 관리 Hook
export function usePortfolios(page = 1, limit = 12, search?: string) {
  const [data, setData] = useState<PaginatedResponse<Portfolio> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getPortfolios(page, limit, search);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : '포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [page, limit, search]);

  const refetch = () => {
    setLoading(true);
    apiClient.getPortfolios(page, limit, search)
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : '오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
}

// 단일 포트폴리오 관리 Hook
export function usePortfolio(id: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getPortfolioById(id);
        if (response.success && response.data) {
          setPortfolio(response.data);
        } else {
          setError(response.error || '포트폴리오를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  const refetch = () => {
    if (!id) return;
    
    setLoading(true);
    apiClient.getPortfolioById(id)
      .then(response => {
        if (response.success && response.data) {
          setPortfolio(response.data);
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : '오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  };

  return { portfolio, loading, error, refetch };
}

// 피드백 관리 Hook
export function useFeedbacks(portfolioId: string) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getPortfolioFeedbacks(portfolioId);
        if (response.success && response.data) {
          setFeedbacks(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) {
      fetchFeedbacks();
    }
  }, [portfolioId]);

  const addFeedback = async (content: string, rating?: number) => {
    try {
      const response = await apiClient.createFeedback({
        content,
        portfolioId,
        rating,
      });
      
      if (response.success && response.data) {
        setFeedbacks(prev => [response.data!, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: response.error || '피드백 등록에 실패했습니다.' };
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : '피드백 등록 중 오류가 발생했습니다.';
      return { success: false, error };
    }
  };

  const likeFeedback = async (feedbackId: string) => {
    try {
      const response = await apiClient.likeFeedback(feedbackId);
      if (response.success && response.data) {
        setFeedbacks(prev => 
          prev.map(feedback => 
            feedback.id === feedbackId ? response.data! : feedback
          )
        );
      }
    } catch (err) {
      console.error('Like feedback failed:', err);
    }
  };

  const unlikeFeedback = async (feedbackId: string) => {
    try {
      const response = await apiClient.unlikeFeedback(feedbackId);
      if (response.success && response.data) {
        setFeedbacks(prev => 
          prev.map(feedback => 
            feedback.id === feedbackId ? response.data! : feedback
          )
        );
      }
    } catch (err) {
      console.error('Unlike feedback failed:', err);
    }
  };

  return { feedbacks, loading, error, addFeedback, likeFeedback, unlikeFeedback };
}

// 사용자 포트폴리오 관리 Hook
export function useUserPortfolios(userId: string) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getUserPortfolios(userId);
        if (response.success && response.data) {
          setPortfolios(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPortfolios();
    }
  }, [userId]);

  const deletePortfolio = async (portfolioId: string) => {
    try {
      const response = await apiClient.deletePortfolio(portfolioId);
      if (response.success) {
        setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        return { success: true };
      } else {
        return { success: false, error: response.error || '포트폴리오 삭제에 실패했습니다.' };
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : '포트폴리오 삭제 중 오류가 발생했습니다.';
      return { success: false, error };
    }
  };

  return { portfolios, loading, error, deletePortfolio };
}
