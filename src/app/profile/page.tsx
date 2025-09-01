'use client';

import { useState } from 'react';
import { User, Settings, LogOut, Star, MessageCircle, Heart, Edit, Trash2, TrendingUp, Award, Calendar, BookOpen, Target, Code, ChevronRight, Eye, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SAMPLE_USER = {
  id: 1,
  name: 'Anonymous_Dev_01',
  email: 'user@example.com',
  role: 'JUNIOR',
  verified: false,
  image: null,
  joinedAt: '2024-08-01',
  bio: '프론트엔드 개발에 관심이 많은 주니어 개발자입니다. React와 TypeScript를 공부하고 있어요! 첫 직장을 구하기 위해 열심히 포트폴리오를 만들고 있습니다.',
  techStack: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'CSS', 'HTML'],
  goals: '2024년 목표: 첫 직장 구하기, React 마스터하기, 오픈소스 기여하기',
  level: 'Beginner',
  experience: '6개월'
};

const SAMPLE_MY_PORTFOLIOS = [
  {
    id: 1,
    title: 'E-커머스 풀스택 웹사이트',
    description: 'React와 Node.js로 만든 온라인 쇼핑몰입니다. 상품 등록, 장바구니, 결제 시스템을 구현했습니다.',
    feedbackCount: 12,
    likes: 28,
    views: 156,
    createdAt: '2024-08-15',
    status: 'published',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    lastUpdated: '2024-08-20',
    avgRating: 4.3
  },
  {
    id: 2,
    title: 'Task Management App',
    description: '팀 프로젝트 관리를 위한 협업 도구입니다. 칸반 보드와 실시간 채팅 기능을 포함합니다.',
    feedbackCount: 5,
    likes: 14,
    views: 89,
    createdAt: '2024-08-20',
    status: 'published',
    techStack: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    lastUpdated: '2024-08-22',
    avgRating: 4.0
  },
  {
    id: 3,
    title: 'Todo App with TypeScript',
    description: 'TypeScript로 만든 간단한 할 일 관리 앱입니다. 드래그 앤 드롭으로 우선순위를 조정할 수 있습니다.',
    feedbackCount: 2,
    likes: 7,
    views: 39,
    createdAt: '2024-08-25',
    status: 'draft',
    techStack: ['TypeScript', 'React', 'Local Storage'],
    lastUpdated: '2024-08-25',
    avgRating: 3.5
  }
];

const SAMPLE_MY_FEEDBACKS = [
  {
    id: 1,
    portfolioTitle: 'React 기반 블로그 플랫폼',
    content: '컴포넌트 구조가 잘 설계되어 있습니다. 상태 관리를 Redux Toolkit으로 개선하면 더 좋을 것 같습니다. 또한 로딩 상태와 에러 처리를 추가하면 더욱 완성도 높은 프로젝트가 될 것입니다.',
    likes: 8,
    createdAt: '2024-08-18',
    authorLevel: 'Senior Frontend Developer',
    helpful: true,
    tags: ['React', 'Architecture', 'State Management']
  },
  {
    id: 2,
    portfolioTitle: 'Node.js API 서버',
    content: 'API 설계가 RESTful하게 잘 되어 있네요. 에러 핸들링과 로깅 시스템을 추가하면 더욱 견고한 서버가 될 것입니다. 미들웨어 패턴도 잘 적용하셨어요.',
    likes: 12,
    createdAt: '2024-08-19',
    authorLevel: 'Senior Backend Developer',
    helpful: true,
    tags: ['Node.js', 'API Design', 'Error Handling']
  },
  {
    id: 3,
    portfolioTitle: 'Todo App with TypeScript',
    content: 'TypeScript 사용법이 좋습니다. 다음에는 테스트 코드를 추가해보시고, 상태 관리 라이브러리도 고려해보세요. 타입 정의가 명확해서 코드 가독성이 높습니다.',
    likes: 5,
    createdAt: '2024-08-21',
    authorLevel: 'Senior Frontend Developer',
    helpful: true,
    tags: ['TypeScript', 'Testing', 'Code Quality']
  },
  {
    id: 4,
    portfolioTitle: 'E-커머스 풀스택 웹사이트',
    content: '전체적인 구조가 인상적입니다. 보안 측면에서 JWT 토큰 관리와 입력값 검증을 더 강화하면 좋겠어요. UI/UX도 직관적이고 사용자 친화적입니다.',
    likes: 15,
    createdAt: '2024-08-23',
    authorLevel: 'Tech Lead',
    helpful: true,
    tags: ['Security', 'Full Stack', 'UX Design']
  }
];

const SAMPLE_STATS = {
  totalPortfolios: 3,
  totalFeedbacks: 19,
  totalLikes: 49,
  totalViews: 284,
  responseRate: 85,
  avgRating: 4.2
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(SAMPLE_USER);

  const handleRoleSwitch = () => {
    if (user.role === 'JUNIOR') {
      // TODO: 시니어 인증 페이지로 이동
      console.log('Redirect to senior verification');
    } else {
      setUser({ ...user, role: 'JUNIOR', verified: false });
    }
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직
    console.log('Logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      {/* 네비게이션 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/feed" className="text-2xl font-bold text-blue-600">
              DevReview
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
                피드
              </Link>
              <Link href="/portfolio/create" className="text-gray-600 hover:text-gray-900 font-medium">
                포트폴리오 작성
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 프로필 헤더 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <Award className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'JUNIOR' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {user.role === 'JUNIOR' ? '주니어 개발자' : '시니어 개발자'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {user.level}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{user.email}</p>
                
                {user.bio && (
                  <p className="text-gray-700 mb-3 max-w-2xl leading-relaxed">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(user.joinedAt).toLocaleDateString('ko-KR')}부터 활동</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>개발 경험 {user.experience}</span>
                  </div>
                </div>
                
                {user.goals && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">2024년 목표</span>
                    </div>
                    <p className="text-sm text-blue-600">{user.goals}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRoleSwitch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {user.role === 'JUNIOR' ? '시니어 인증하기' : '주니어로 전환'}
              </button>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 기술 스택 */}
          {user.techStack && user.techStack.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">기술 스택</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-blue-700 text-sm rounded-full border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 통계 대시보드 */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.totalPortfolios}</p>
                <p className="text-xs text-gray-500">포트폴리오</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.totalFeedbacks}</p>
                <p className="text-xs text-gray-500">받은 피드백</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.totalLikes}</p>
                <p className="text-xs text-gray-500">받은 좋아요</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.totalViews}</p>
                <p className="text-xs text-gray-500">총 조회수</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.avgRating}</p>
                <p className="text-xs text-gray-500">평균 평점</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{SAMPLE_STATS.responseRate}%</p>
                <p className="text-xs text-gray-500">응답률</p>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'dashboard', label: '대시보드', icon: TrendingUp },
              { id: 'portfolios', label: '내 포트폴리오', icon: BookOpen },
              { id: 'feedbacks', label: '받은 피드백', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* 대시보드 탭 */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 최근 활동 */}
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">새 포트폴리오 작성</p>
                          <p className="text-xs text-gray-500">Todo App with TypeScript - 2일 전</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">피드백 받음</p>
                          <p className="text-xs text-gray-500">E-커머스 프로젝트 - 4일 전</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">좋아요 받음</p>
                          <p className="text-xs text-gray-500">Task Management App - 1주 전</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 성장 지표 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">성장 지표</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">피드백 반영률</span>
                          <span className="text-sm font-bold text-green-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">코드 품질 점수</span>
                          <span className="text-sm font-bold text-green-600">4.2/5.0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">월간 성장률</span>
                          <span className="text-sm font-bold text-green-600">+23%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추천 학습 경로 */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">추천 학습 경로</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium text-gray-900">React 심화</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Hooks, Context API, 성능 최적화</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">진행률 60%</span>
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Code className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium text-gray-900">테스트 코드</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Jest, React Testing Library</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">추천</span>
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium text-gray-900">알고리즘</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">코딩테스트 대비 문제 풀이</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">기초</span>
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 포트폴리오 탭 */}
            {activeTab === 'portfolios' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">내 포트폴리오</h3>
                  <Link
                    href="/portfolio/create"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    새 포트폴리오 작성
                  </Link>
                </div>
                
                <div className="grid gap-6">
                  {SAMPLE_MY_PORTFOLIOS.map((portfolio) => (
                    <div key={portfolio.id} className="bg-gradient-to-r from-white to-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{portfolio.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              portfolio.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {portfolio.status === 'published' ? '게시됨' : '임시저장'}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{portfolio.avgRating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{portfolio.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {portfolio.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Link href={`/portfolio/${portfolio.id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-blue-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{portfolio.views} 조회</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{portfolio.feedbackCount} 피드백</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{portfolio.likes} 좋아요</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>작성: {new Date(portfolio.createdAt).toLocaleDateString('ko-KR')}</span>
                          <span>수정: {new Date(portfolio.lastUpdated).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 피드백 탭 */}
            {activeTab === 'feedbacks' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">받은 피드백</h3>
                  <div className="text-sm text-gray-500">
                    총 {SAMPLE_MY_FEEDBACKS.length}개의 피드백
                  </div>
                </div>
                
                <div className="space-y-6">
                  {SAMPLE_MY_FEEDBACKS.map((feedback) => (
                    <div key={feedback.id} className="bg-gradient-to-r from-white to-green-50 rounded-lg p-6 border border-green-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{feedback.portfolioTitle}</h4>
                            {feedback.helpful && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                도움됨
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {feedback.authorLevel}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="text-sm font-medium text-gray-700">{feedback.likes}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{feedback.content}</p>
                      
                      {feedback.tags && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-green-100">
                          {feedback.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white text-green-700 text-xs rounded-full border border-green-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
