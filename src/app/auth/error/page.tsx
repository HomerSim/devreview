'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorMessage = searchParams?.get('message');
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    } else {
      setError('알 수 없는 오류가 발생했습니다.');
    }
  }, [searchParams]);

  const handleRetry = () => {
    // 메인 페이지로 돌아가서 다시 로그인 시도
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            로그인 오류
          </h1>
          <p className="text-red-600 mb-6">
            {error || '로그인 중 오류가 발생했습니다.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>다시 시도하기</span>
            </button>
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 에러 상세 정보 */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">문제 해결 방법</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 브라우저를 새로고침하고 다시 시도해주세요</li>
            <li>• 팝업 차단 설정을 확인해주세요</li>
            <li>• 브라우저의 쿠키 설정을 확인해주세요</li>
            <li>• 문제가 계속되면 관리자에게 문의해주세요</li>
          </ul>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded border">
              <p className="text-xs font-mono text-red-800 break-all">
                Error: {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
