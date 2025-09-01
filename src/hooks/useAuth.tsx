'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UpdateUserRequest } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { email: string; password: string; name: string; role: 'JUNIOR' | 'SENIOR' }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: UpdateUserRequest) => Promise<void>;
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

        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('auth_token', token);
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: response.error || '로그인에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const register = async (userData: { 
    email: string; 
    password: string; 
    name: string; 
    role: 'JUNIOR' | 'SENIOR' 
  }) => {
    try {
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        // 회원가입 후 자동 로그인
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        return { success: false, error: response.error || '회원가입에 실패했습니다.' };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const updateUser = async (userData: UpdateUserRequest) => {
    if (!user) return;
    
    try {
      const response = await apiClient.updateUser(user.id, userData);
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
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
