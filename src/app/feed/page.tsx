'use client';

import { useState } from 'react';
import { Search, Filter, Heart, MessageCircle, Plus, User, Menu } from 'lucide-react';
import Link from 'next/link';

const TECH_FILTERS = ['전체', '프론트엔드', '백엔드', '모바일', 'DevOps', 'AI/ML'];

const SAMPLE_PORTFOLIOS = [
  {
    id: 1,
    title: 'E-커머스 풀스택 웹사이트',
    description: 'React와 Node.js로 만든 온라인 쇼핑몰입니다',
    author: 'Anonymous_Dev_01',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    feedbackCount: 12,
    likes: 28,
    category: '프론트엔드'
  },
  {
    id: 2,
    title: 'AI 기반 이미지 분류 앱',
    description: 'TensorFlow를 활용한 실시간 이미지 인식 모바일 앱',
    author: 'Anonymous_Dev_02',
    techStack: ['React Native', 'TensorFlow', 'Python', 'Firebase'],
    feedbackCount: 8,
    likes: 35,
    category: 'AI/ML'
  },
  {
    id: 3,
    title: 'MSA 기반 배송 관리 시스템',
    description: '마이크로서비스 아키텍처로 구현한 물류 관리 시스템',
    author: 'Anonymous_Dev_03',
    techStack: ['Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL'],
    feedbackCount: 15,
    likes: 42,
    category: '백엔드'
  },
  {
    id: 4,
    title: '실시간 채팅 앱',
    description: 'Socket.io를 이용한 실시간 채팅 애플리케이션',
    author: 'Anonymous_Dev_04',
    techStack: ['Vue.js', 'Socket.io', 'Redis', 'Node.js'],
    feedbackCount: 6,
    likes: 19,
    category: '프론트엔드'
  }
];

export default function FeedPage() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPortfolios = SAMPLE_PORTFOLIOS.filter(portfolio => {
    const matchesFilter = selectedFilter === '전체' || portfolio.category === selectedFilter;
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
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
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
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
          <div className="flex gap-2 overflow-x-auto">
            {TECH_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white'
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
                    {portfolio.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-50 text-blue-500 text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {portfolio.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{portfolio.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{portfolio.author}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{portfolio.feedbackCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{portfolio.likes}</span>
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
