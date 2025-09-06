'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/api';
import { useOAuth } from '@/hooks/useOAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  // OAuth 관련 기능 추가
  oauthStatus: any;
  refreshOAuthToken: () => Promise<boolean>;
  disconnectOAuth: () => Promise<boolean>;
  // 🔐 유틸리티 함수들 추가
  isAuthenticated: boolean;
  requireAuth: (action: () => void, message?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // OAuth 관리 hook 사용
  const { oauthStatus, refreshToken, disconnect } = useOAuth();

  // 초기 사용자 정보 로드
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🍪 쿠키 기반: 서버에서 인증 상태 확인
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // 쿠키 포함
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
        
        setLoading(false);
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      // 🍪 쿠키 기반: 로그아웃 API 호출
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        console.log('✅ Logout successful');
      }

      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 🔐 인증이 필요한 작업을 수행할 때 사용하는 함수
  const requireAuth = (action: () => void, message = '이 기능을 사용하려면 로그인이 필요합니다.') => {
    if (!user) {
      if (confirm(`${message}\n로그인 페이지로 이동하시겠습니까?`)) {
        window.location.href = '/login';
      }
      return;
    }
    action();
  };

  const value = {
    user,
    loading,
    logout,
    setUser,
    oauthStatus,
    refreshOAuthToken: refreshToken,
    disconnectOAuth: disconnect,
    isAuthenticated: !!user,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 인증이 필요한 컴포넌트를 위한 HOC
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-6">이 페이지를 사용하려면 로그인이 필요합니다.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
