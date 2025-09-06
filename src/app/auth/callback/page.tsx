'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkStatus } = useOAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 토큰과 상태 정보 추출
        const token = searchParams?.get('token');
        const userId = searchParams?.get('user_id');
        const error = searchParams?.get('error');
        const message = searchParams?.get('message');
        const provider = searchParams?.get('provider');

        // 에러 처리
        if (error || message) {
          const errorMsg = message || error || '로그인 중 오류가 발생했습니다.';
          setError(decodeURIComponent(errorMsg));
          setStatus('error');
          return;
        }

        // 토큰 검증
        if (!token) {
          setError('인증 토큰을 받지 못했습니다.');
          setStatus('error');
          return;
        }

        // ✅ 쿠키 기반: API 엔드포인트로 토큰 설정
        const cookieResponse = await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify({ token, user_id: userId }),
        });

        if (!cookieResponse.ok) {
          setError('인증 쿠키 설정에 실패했습니다.');
          setStatus('error');
          return;
        }

        console.log('Auth successful with cookies:', { userId, provider });

        // 🚀 바로 feed 페이지로 이동
        router.push('/feed');

      } catch (err) {
        console.error('Auth callback error:', err);
        setError('인증 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [searchParams, router, checkStatus]);

  // 로딩 중이거나 에러가 있을 때만 UI 표시
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-blue-500 mb-4">
            <Loader className="w-16 h-16 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그인 처리 중...
          </h1>
          <p className="text-gray-600">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              로그인 실패
            </h1>
            <p className="text-red-600 mb-6">
              {error || '로그인 중 오류가 발생했습니다.'}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              다시 로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 성공 시에는 바로 리디렉션되므로 빈 화면
  return null;
}
