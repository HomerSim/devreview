'use client';

import { User, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              DevReview에 오신 것을 환영합니다
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              어떤 역할로 참여하시겠습니까?
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Junior Developer Card */}
            <Link href="/feed" className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white transition-all duration-300 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md h-full">
                <div className="text-6xl mb-6">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  주니어 개발자
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  포트폴리오 리뷰를 받고 싶어요
                </p>
                <div className="space-y-3 text-sm text-gray-600 mb-6 sm:mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>포트폴리오 업로드</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>시니어 피드백 받기</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>실무 중심 조언</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-500 font-semibold group-hover:gap-4 transition-all">
                  <span>시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Senior Developer Card */}
            <Link href="/senior/verify" className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white transition-all duration-300 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md h-full">
                <div className="text-6xl mb-6">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  시니어 개발자
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  주니어에게 도움을 주고 싶어요
                </p>
                <div className="space-y-3 text-sm text-gray-600 mb-6 sm:mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>포트폴리오 리뷰</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>전문가 피드백 제공</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    <span>개발 커뮤니티 기여</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-500 font-semibold group-hover:gap-4 transition-all">
                  <span className="text-center">인증하고 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 sm:mt-12">
            <p className="text-gray-600 text-sm">
              언제든지 역할을 변경할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
