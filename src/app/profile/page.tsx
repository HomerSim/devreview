'use client';

import { useState } from 'react';
import { User, Settings, LogOut, Edit, Eye, Plus, Calendar, BookOpen, MessageCircle, Heart, Star } from 'lucide-react';
import Link from 'next/link';

// 🎯 실제 사용 가능한 최소한의 사용자 정보
const SAMPLE_USER = {
  id: 1,
  name: 'Anonymous_Dev_01',
  role: 'JUNIOR',
  verified: false,
  joinedAt: '2024-08-01',
  portfolioCount: 3,
  totalFeedbackReceived: 12,
  totalLikes: 28
};

// 🎯 내가 작성한 포트폴리오 목록 (최소 정보)
const MY_PORTFOLIOS = [
  {
    id: 1,
    title: 'E-커머스 풀스택 웹사이트',
    status: 'published',
    createdAt: '2024-08-15',
    views: 156,
    likes: 28,
    feedbackCount: 8
  },
  {
    id: 2,
    title: 'Task Management App',
    status: 'published',
    createdAt: '2024-08-20',
    views: 89,
    likes: 14,
    feedbackCount: 5
  },
  {
    id: 3,
    title: 'Todo App with TypeScript',
    status: 'draft',
    createdAt: '2024-08-25',
    views: 39,
    likes: 7,
    feedbackCount: 2
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState(SAMPLE_USER);

  const handleRoleSwitch = () => {
    if (user.role === 'JUNIOR') {
      // 시니어 인증 페이지로 이동
      window.location.href = '/senior/verify';
    } else {
      setUser({ ...user, role: 'JUNIOR', verified: false });
    }
  };

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직
    console.log('Logout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/feed" className="text-2xl font-bold text-blue-600">
              DevReview
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/feed" className="text-gray-600 hover:text-gray-900">
                피드
              </Link>
              <Link href="/portfolio/create" className="text-gray-600 hover:text-gray-900">
                포트폴리오 작성
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 기본 정보 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'JUNIOR' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {user.role === 'JUNIOR' ? '주니어 개발자' : '시니어 개발자'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(user.joinedAt).toLocaleDateString('ko-KR')}부터 활동
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleRoleSwitch}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {user.role === 'JUNIOR' ? '시니어 인증' : '주니어로 전환'}
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 간단한 통계 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{user.portfolioCount}</p>
            <p className="text-sm text-gray-500">포트폴리오</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{user.totalFeedbackReceived}</p>
            <p className="text-sm text-gray-500">받은 피드백</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow sm:col-span-1">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{user.totalLikes}</p>
            <p className="text-sm text-gray-500">받은 좋아요</p>
          </div>
        </div>

        {/* 내 포트폴리오 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">내 포트폴리오</h2>
            <Link
              href="/portfolio/create"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              새 포트폴리오
            </Link>
          </div>

          <div className="space-y-4">
            {MY_PORTFOLIOS.map((portfolio) => (
              <div
                key={portfolio.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate text-base sm:text-lg">{portfolio.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                        portfolio.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {portfolio.status === 'published' ? '게시됨' : '임시저장'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{portfolio.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{portfolio.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{portfolio.feedbackCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end lg:ml-4">
                    <Link href={`/portfolio/${portfolio.id}`}>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {MY_PORTFOLIOS.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 작성한 포트폴리오가 없습니다
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                첫 번째 포트폴리오를 작성해보세요!
              </p>
              <Link
                href="/portfolio/create"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                포트폴리오 작성하기
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
