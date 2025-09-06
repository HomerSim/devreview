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

  const value = {
    user,
    loading,
    logout,
    setUser,
    oauthStatus,
    refreshOAuthToken: refreshToken,
    disconnectOAuth: disconnect,
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!user) {
      // 로그인 페이지로 리다이렉트 (나중에 구현)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
            <p className="text-gray-600">이 페이지를 사용하려면 로그인해주세요.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
