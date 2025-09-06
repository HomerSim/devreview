'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 사용자 정보 로드
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // 토큰이 있으면 사용자 정보를 가져와야 하는데, 
        // 현재는 SSO만 지원하므로 토큰만 확인
        // 실제 사용자 정보는 백엔드에서 가져와야 함
        setLoading(false);
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('auth_token');
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      // 백엔드에 로그아웃 요청을 보낼 수도 있음
      localStorage.removeItem('auth_token');
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
