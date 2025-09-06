'use client';

import { Github, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/sso/google');
      const data = await response.json();
      
      console.log(data);
      if (data.success && data.data?.authUrl) {
        window.location.href = data.data.authUrl;
      } else {
        throw new Error(data.message || 'Failed to get auth URL');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleGithubLogin = async () => {
    try {
      const response = await fetch('/api/auth/sso/github');
      const data = await response.json();
      
      if (data.success && data.data?.authUrl) {
        window.location.href = data.data.authUrl;
      } else {
        throw new Error(data.message || 'Failed to get auth URL');
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              DevReview
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed px-2">
              AI는 줄 수 없는, 시니어의 진짜 피드백으로<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>취업 관문을 뚫으세요
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 px-2">
              실무 경험이 풍부한 시니어 개발자들로부터 포트폴리오에 대한<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>구체적이고 실용적인 피드백을 받아보세요
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
            <button 
              onClick={handleGithubLogin}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <Github className="w-5 h-5" />
              GitHub로 시작하기
            </button>
            <button 
              onClick={handleGoogleLogin}
              className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Google로 시작하기
            </button>
          </div>

          {/* Features */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mb-12 sm:mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-gray-900 border border-blue-100">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">실무 중심 피드백</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                현업에서 활동하는 시니어 개발자들이 실무 관점에서 구체적인 개선점을 제안합니다
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-gray-900 border border-blue-100">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">익명 리뷰 시스템</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                부담 없는 익명 환경에서 솔직하고 건설적인 피드백을 주고받을 수 있습니다
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-gray-900 border border-blue-100">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">성장 지향</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                단순한 평가가 아닌, 실제 취업과 성장에 도움이 되는 방향성을 제시합니다
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <Link 
              href="/role-selection"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
