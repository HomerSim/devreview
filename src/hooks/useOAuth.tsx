'use client';

import { useState, useEffect, useCallback } from 'react';

interface OAuthStatus {
  is_connected: boolean;
  provider?: string;
  expires_at?: string;
  is_expired: boolean;
  can_refresh: boolean;
}

interface UseOAuthReturn {
  oauthStatus: OAuthStatus | null;
  loading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
}

export function useOAuth(): UseOAuthReturn {
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 헬퍼 함수
  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }, []);

  // OAuth 상태 확인
  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/api/auth/check-oauth-status', {
        method: 'POST'
      });
      
      if (response.success && response.data) {
        setOauthStatus(response.data);
      } else {
        throw new Error(response.error || 'Failed to check OAuth status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Check OAuth status error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // OAuth 토큰 갱신
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/api/auth/refresh-oauth-token', {
        method: 'POST'
      });
      
      if (response.success) {
        // 상태 갱신
        await checkStatus();
        return true;
      } else {
        throw new Error(response.error || 'Failed to refresh OAuth token');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Refresh OAuth token error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiCall, checkStatus]);

  // OAuth 연동 해제
  const disconnect = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/api/auth/disconnect-oauth', {
        method: 'POST'
      });
      
      if (response.success) {
        // 상태 초기화
        setOauthStatus(null);
        return true;
      } else {
        throw new Error(response.error || 'Failed to disconnect OAuth');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Disconnect OAuth error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // 자동 토큰 갱신 로직
  const handleAutoRefresh = useCallback(async () => {
    if (!oauthStatus) return;
    
    const { is_connected, is_expired, can_refresh } = oauthStatus;
    
    if (is_connected && is_expired && can_refresh) {
      console.log('Auto-refreshing expired OAuth token...');
      const success = await refreshToken();
      if (success) {
        console.log('OAuth token refreshed successfully');
      } else {
        console.error('Failed to auto-refresh OAuth token');
      }
    }
  }, [oauthStatus, refreshToken]);

  // 컴포넌트 마운트 시 초기 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      checkStatus();
    }
  }, [checkStatus]);

  // 주기적인 토큰 상태 체크 (5분마다)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const interval = setInterval(() => {
      checkStatus().then(() => {
        handleAutoRefresh();
      });
    }, 5 * 60 * 1000); // 5분마다 체크

    return () => clearInterval(interval);
  }, [checkStatus, handleAutoRefresh]);

  return {
    oauthStatus,
    loading,
    error,
    checkStatus,
    refreshToken,
    disconnect,
  };
}

// OAuth 상태를 표시하는 컴포넌트용 Hook
export function useOAuthStatus() {
  const { oauthStatus, loading, error, checkStatus, refreshToken, disconnect } = useOAuth();
  
  const isConnected = oauthStatus?.is_connected ?? false;
  const isExpired = oauthStatus?.is_expired ?? false;
  const canRefresh = oauthStatus?.can_refresh ?? false;
  const provider = oauthStatus?.provider;
  const expiresAt = oauthStatus?.expires_at;

  return {
    isConnected,
    isExpired,
    canRefresh,
    provider,
    expiresAt,
    loading,
    error,
    checkStatus,
    refreshToken,
    disconnect,
  };
}
