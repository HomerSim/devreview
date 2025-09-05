'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Heart, MessageCircle, Plus, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { TECH_CATEGORIES } from '@/constants/categories';

// 🎯 Feed UI에서만 사용하는 필드들만 포함
interface PortfolioSummary {
  id: string;
  category: string;        // 필터링용
  title: string;          // 카드 제목
  description: string;    // 카드 설명
  tech_stack: string[];   // 기술 스택 태그
  view_count: number;     // 조회수
  like_count: number;     // 좋아요 수
  user: {
    name: string;         // 작성자명
  };
}

interface ApiResponse {
  data: PortfolioSummary[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// 🎯 Feed UI에 필요한 필드만 포함한 샘플 데이터
const SAMPLE_PORTFOLIOS: PortfolioSummary[] = [
  {
    id: "sample-1",
    category: "프론트엔드",
    title: 'E-커머스 풀스택 웹사이트',
    description: 'React와 Node.js로 만든 온라인 쇼핑몰입니다',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    view_count: 156,
    like_count: 28,
    user: {
      name: 'Anonymous_Dev_01'
    }
  },
  {
    id: "sample-2",
    category: "AI/ML",
    title: 'AI 기반 이미지 분류 앱',
    description: 'TensorFlow를 활용한 실시간 이미지 인식 모바일 앱',
    tech_stack: ['React Native', 'TensorFlow', 'Python', 'Firebase'],
    view_count: 98,
    like_count: 35,
    user: {
      name: 'Anonymous_Dev_02'
    }
  },
  {
    id: "sample-3",
    category: "백엔드",
    title: 'MSA 기반 배송 관리 시스템',
    description: '마이크로서비스 아키텍처로 구현한 물류 관리 시스템',
    tech_stack: ['Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL'],
    view_count: 203,
    like_count: 42,
    user: {
      name: 'Anonymous_Dev_03'
    }
  },
  {
    id: "sample-4",
    category: "프론트엔드",
    title: '실시간 채팅 앱',
    description: 'Socket.io를 이용한 실시간 채팅 애플리케이션',
    tech_stack: ['Vue.js', 'Socket.io', 'Redis', 'Node.js'],
    view_count: 87,
    like_count: 19,
    user: {
      name: 'Anonymous_Dev_04'
    }
  },
  {
    id: "sample-5",
    category: "모바일",
    title: '피트니스 트래킹 앱',
    description: 'React Native로 개발한 개인 운동 기록 관리 앱',
    tech_stack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    view_count: 124,
    like_count: 31,
    user: {
      name: 'Anonymous_Dev_05'
    }
  },
  {
    id: "sample-6",
    category: "DevOps",
    title: 'CI/CD 파이프라인 구축',
    description: 'Jenkins와 Docker를 활용한 자동화 배포 시스템',
    tech_stack: ['Jenkins', 'Docker', 'AWS', 'Terraform'],
    view_count: 167,
    like_count: 53,
    user: {
      name: 'Anonymous_Dev_06'
    }
  }
];

export default function FeedPage() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔍 Full API Response:', data);
        console.log('📊 Portfolio Data:', data.data);
        console.log('📈 Total Count:', data.total);
        
        // ✅ 실제 포트폴리오 배열만 설정
        if (data.data && data.data.length > 0) {
          setPortfolios(data.data);
        } else {
          // API 데이터가 없으면 샘플 데이터 사용
          console.log('📝 Using sample data as fallback');
          setPortfolios(SAMPLE_PORTFOLIOS);
        }
      } catch (error) {
        console.error('❌ Error fetching portfolios:', error);
        console.log('📝 Using sample data as fallback');
        // 오류 발생 시 샘플 데이터 사용
        setPortfolios(SAMPLE_PORTFOLIOS);
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
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </Link>
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
                  <span>{portfolio.user.name}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{portfolio.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{portfolio.like_count}</span>
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