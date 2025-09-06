'use client';

import { useState } from 'react';
import { User, Settings, LogOut, Edit, Eye, Plus, Calendar, BookOpen, MessageCircle, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';

export default function ProfilePage() {
  const { user, portfolios, isLoading, error, handleRoleSwitch, deletePortfolio } = useUserProfile();
  const { logout } = useAuth();
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    portfolioId?: string;
    portfolioTitle?: string;
    feedbackCount?: number;
    isDeleting?: boolean;
  }>({ isOpen: false });

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 삭제 버튼 클릭 처리
  const handleDeleteClick = (portfolioId: string, portfolioTitle: string, feedbackCount: number) => {
    setDeleteModal({
      isOpen: true,
      portfolioId,
      portfolioTitle,
      feedbackCount,
      isDeleting: false
    });
  };

  // 삭제 확인 처리
  const handleDeleteConfirm = async () => {
    if (!deleteModal.portfolioId) return;

    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));
      
      await deletePortfolio(deleteModal.portfolioId);
      
      // 모달 닫기
      setDeleteModal({ isOpen: false });
      
    } catch (err) {
      console.error('Delete portfolio failed:', err);
      // 에러 처리는 여기서 할 수 있지만, 일단 모달은 열어둠
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // 모달 닫기
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false });
  };

  if (isLoading) {
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
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* 로딩 스켈레톤 */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="text-center sm:text-left">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded mb-2 w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded mb-2 w-12 mx-auto animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="h-6 bg-gray-200 rounded mb-6 w-32 animate-pulse"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="h-5 bg-gray-200 rounded mb-2 w-64 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">프로필을 불러올 수 없습니다</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
            <Link 
              href="/feed" 
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              피드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">사용자 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
                {user.image && user.image !== 'string' ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'JUNIOR' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {user.role === 'JUNIOR' ? '주니어 개발자' : '시니어 개발자'}
                    </span>
                    {user.isVerified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        인증됨
                      </span>
                    )}
                  </div>
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

        {/* 통계 카드 - 백엔드 데이터 사용 */}
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
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{user.totalLikes}</p>
            <p className="text-sm text-gray-500">받은 좋아요</p>
          </div>
        </div>

        {/* 내 포트폴리오 목록 (임시 데이터 - 추후 API 연동 예정) */}
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
            {portfolios?.map((portfolio) => (
              <div
                key={portfolio.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate text-base sm:text-lg">{portfolio.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(portfolio.updatedAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{portfolio.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{portfolio.likeCount}</span>
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
                    <Link href={`/portfolio/edit/${portfolio.id}`}>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(portfolio.id, portfolio.title, portfolio.feedbackCount)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 포트폴리오가 없을 때 */}
          {(!portfolios || portfolios.length === 0) && (
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
      
      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="포트폴리오 삭제"
        message="삭제된 포트폴리오는 복구할 수 없습니다."
        portfolioTitle={deleteModal.portfolioTitle}
        feedbackCount={deleteModal.feedbackCount || 0}
        isLoading={deleteModal.isDeleting || false}
      />
    </div>
  );
}
