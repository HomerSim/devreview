'use client';

import { OAuthStatusCard, OAuthStatusIndicator } from '@/components/oauth/OAuthStatus';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function OAuthTestPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OAuth 관리</h1>
              <p className="text-gray-600 mt-1">소셜 로그인 연동 상태를 확인하고 관리하세요</p>
            </div>
            <div className="flex items-center space-x-4">
              <OAuthStatusIndicator />
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* OAuth 상태 카드 */}
        <OAuthStatusCard />

        {/* 네비게이션 */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">페이지 이동</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-blue-900">홈페이지</h3>
              <p className="text-sm text-blue-600 mt-1">메인 페이지로 이동</p>
            </Link>
            <Link
              href="/role-selection"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-green-900">역할 선택</h3>
              <p className="text-sm text-green-600 mt-1">사용자 역할 설정</p>
            </Link>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">OAuth 기능 안내</h2>
          <div className="prose prose-sm text-gray-600">
            <ul className="space-y-2">
              <li><strong>자동 토큰 갱신:</strong> 5분마다 토큰 상태를 확인하고, 만료된 경우 자동으로 갱신합니다.</li>
              <li><strong>수동 토큰 갱신:</strong> "토큰 갱신" 버튼으로 언제든지 토큰을 갱신할 수 있습니다.</li>
              <li><strong>연동 해제:</strong> "연동 해제" 버튼으로 OAuth 연동을 완전히 해제할 수 있습니다.</li>
              <li><strong>상태 확인:</strong> "상태 확인" 버튼으로 최신 연동 상태를 확인할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
