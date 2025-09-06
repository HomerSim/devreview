'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

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

        // 토큰과 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('auth_token', token);
        if (userId) {
          localStorage.setItem('user_id', userId);
        }
        
        console.log('Auth successful:', { token: token.substring(0, 20) + '...', userId, provider });
        
        setStatus('success');
        
        // 2초 후 역할 선택 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/role-selection');
        }, 2000);

      } catch (err) {
        console.error('Auth callback error:', err);
        setError('인증 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {status === 'loading' && (
            <>
              <div className="text-blue-500 mb-4">
                <Loader className="w-16 h-16 mx-auto animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                로그인 처리 중...
              </h1>
              <p className="text-gray-600">
                잠시만 기다려주세요. 로그인을 완료하고 있습니다.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                로그인 성공!
              </h1>
              <p className="text-gray-600 mb-4">
                DevReview에 오신 것을 환영합니다!<br />
                곧 역할 선택 페이지로 이동합니다.
              </p>
              <div className="animate-pulse text-blue-500 text-sm">
                리다이렉트 중...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 mb-4">
                <XCircle className="w-16 h-16 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                로그인 실패
              </h1>
              <p className="text-red-600 mb-6">
                {error || '로그인 중 오류가 발생했습니다.'}
              </p>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  다시 로그인하기
                </Link>
                <Link
                  href="/"
                  className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </>
          )}
        </div>

        {/* 추가 도움말 */}
        {status === 'error' && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">문제 해결</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 팝업 차단 설정을 확인해주세요</li>
              <li>• 브라우저의 쿠키 설정을 확인해주세요</li>
              <li>• 잠시 후 다시 시도해주세요</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
