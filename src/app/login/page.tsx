'use client';

import { useState } from 'react';
import { Github, Mail, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSSOLogin = async (provider: 'google' | 'github') => {
    setLoading(provider);
    setError('');
    
    try {
      // 백엔드에서 SSO 인증 URL 가져오기
      const authUrl = await apiClient.getSSOAuthUrl(provider);
      
      // SSO 인증 페이지로 리다이렉트
      window.location.href = authUrl;
    } catch (err) {
      console.error('SSO Login failed:', err);
      setError('SSO 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 브랜드 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
              DevReview
            </h1>
            <p className="text-gray-600 text-sm">개발자 포트폴리오 리뷰 플랫폼</p>
          </Link>
        </div>

        {/* 메인 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            시니어의 진짜 피드백으로 성장하세요
          </h2>
          <p className="text-gray-600">
            소셜 로그인으로 간편하게 시작하세요
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Google 로그인 */}
            <button
              onClick={() => handleSSOLogin('google')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'google' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Google로 계속하기</span>
                </>
              )}
            </button>

            {/* GitHub 로그인 */}
            <button
              onClick={() => handleSSOLogin('github')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'github' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  <span className="font-medium">GitHub로 계속하기</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              로그인하면 DevReview의{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                이용약관
              </Link>
              {' '}및{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                개인정보처리방침
              </Link>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>

        {/* 서비스 특징 */}
        <div className="mt-8 bg-blue-50/80 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">왜 DevReview인가요?</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">검증된 시니어 개발자들의 실무 피드백</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">포트폴리오 개선을 통한 취업 성공률 향상</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">개발자 커뮤니티에서의 네트워킹 기회</span>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            <span>홈으로 돌아가기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
