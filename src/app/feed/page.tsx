'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Heart, MessageCircle, Plus, User, Menu, Eye } from 'lucide-react';
import Link from 'next/link';
import { TECH_CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';

// 🎯 Feed UI에서만 사용하는 필드들만 포함
interface PortfolioSummary {
  id: string;
  category: string;        // 필터링용
  title: string;          // 카드 제목
  description: string;    // 카드 설명
  tech_stack: string[];   // 기술 스택 태그
  view_count: number;     // 조회수
  like_count: number;     // 좋아요 수
  feedback_count: number; // 피드백 개수
  user: {
    name: string;         // 작성자명
  } | null; // 사용자가 탈퇴한 경우 null일 수 있음
}

interface ApiResponse {
  data: PortfolioSummary[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function FeedPage() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ✅ 실제 포트폴리오 배열만 설정
        if (data.data && data.data.length > 0) {
          setPortfolios(data.data);
        } else {
          // API 데이터가 없으면 빈 배열 설정
          setPortfolios([]);
        }
      } catch (error) {
        console.error('❌ Error fetching portfolios:', error);
        // 오류 발생 시 빈 배열 설정
        setPortfolios([]);
      }
    };
    
    fetchPortfolios();
  }, []);

  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesFilter = selectedFilter === '전체' || portfolio.category === selectedFilter;
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 lg:gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                DevReview
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/feed" className="text-gray-900 font-medium">
                  피드
                </Link>
                <Link href="/portfolio/create" className="text-gray-600 hover:text-gray-900">
                  포트폴리오 만들기
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              {isAuthenticated ? (
                // 🎯 로그인된 사용자: 프로필 링크
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={`프로필: ${user?.name || '사용자'}`}
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="hidden sm:inline text-sm text-gray-700">
                    {user?.name || '프로필'}
                  </span>
                </Link>
              ) : (
                // 🎯 비로그인 사용자: 로그인 유도 버튼
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>로그인</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="포트폴리오 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {TECH_CATEGORIES.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-blue-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPortfolios.map((portfolio) => (
            <Link key={portfolio.id} href={`/portfolio/${portfolio.id}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {portfolio.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {portfolio.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tech_stack.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-50 text-blue-500 text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {portfolio.tech_stack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{portfolio.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{portfolio.user?.name || '탈퇴한 사용자'}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="피드백 개수">
                      <MessageCircle className="w-4 h-4" />
                      <span>{portfolio.feedback_count}</span>
                    </div>
                    <div className="flex items-center gap-1" title="좋아요 개수">
                      <Heart className="w-4 h-4" />
                      <span>{portfolio.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1" title="조회수">
                      <Eye className="w-4 h-4" />
                      <span>{portfolio.view_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              다른 키워드나 필터를 시도해보세요
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Link
        href="/portfolio/create"
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}