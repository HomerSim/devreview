'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Github, Heart, MessageCircle, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { PortfolioDetail, FeedbackData } from '@/types/portfolio';
import { formatDate, formatRelativeTime } from '@/lib/utils/date';
import { FeedbackSection } from '@/components/portfolio/FeedbackSection';
import { PortfolioSidebar } from './components/PortfolioSidebar';
import { useAuth } from '@/hooks/useAuth';
import { PortfolioDetailSkeleton } from '@/components/ui/skeleton';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';

interface Props {
  params: Promise<{ id: string }>;
}

// 🎯 메인 컴포넌트 (클라이언트 컴포넌트로 변경)
export default function PortfolioDetailPage({ params }: Props) {
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { refreshAuthState } = useAuth();

  // 삭제 모달 상태 추가
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    portfolioId?: string;
    portfolioTitle?: string;
    feedbackCount?: number;
    isDeleting?: boolean;
  }>({ isOpen: false });

  // 🔄 페이지 포커스 시 인증 상태 새로고침
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAuthState();
      }
    };

    const handleFocus = () => {
      refreshAuthState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshAuthState]);

  // 포트폴리오 데이터 로드
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/portfolios/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          setError('포트폴리오를 불러올 수 없습니다.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('🔍 Portfolio API Response:', data); // 디버깅용
        setPortfolio(data.data || data);
      } catch (error) {
        console.error('포트폴리오 조회 에러:', error);
        setError('포트폴리오를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [params]);

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
      
      const response = await fetch(`/api/portfolios/${deleteModal.portfolioId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('포트폴리오 삭제에 실패했습니다.');
      }

      // 삭제 성공 시 피드 페이지로 이동
      window.location.href = '/feed';
      
    } catch (err) {
      console.error('Delete portfolio failed:', err);
      alert('포트폴리오 삭제에 실패했습니다. 다시 시도해주세요.');
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // 모달 닫기
  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false });
  };

  if (loading) {
    return <PortfolioDetailSkeleton />;
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">포트폴리오를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-4">{error || '요청하신 포트폴리오가 존재하지 않습니다.'}</p>
          <Link 
            href="/feed" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            피드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                <span className="hidden sm:inline">포트폴리오 상세</span>
                <span className="sm:hidden">상세</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* 포트폴리오 정보 */}
            <PortfolioHeader portfolio={portfolio} />

            {/* 상세 설명 */}
            <PortfolioContent content={portfolio.content} />

            {/* 🎯 피드백은 클라이언트 컴포넌트로 분리 (인터랙티브) */}
            <FeedbackSection portfolioId={portfolio.id} />
          </div>

          {/* 사이드바 - Zustand로 실시간 좋아요 수 공유 */}
          <PortfolioSidebar 
            portfolio={portfolio} 
            onDeleteClick={handleDeleteClick}
          />
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

// 🎯 포트폴리오 헤더 컴포넌트
function PortfolioHeader({ portfolio }: { portfolio: PortfolioDetail }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        {/* 카테고리 배지 */}
        <div className="mb-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            {portfolio.category}
          </span>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {portfolio.title}
        </h1>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {portfolio.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
          <span>작성자: {portfolio.user?.name || '탈퇴회원'}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatDate(portfolio.created_at)}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatRelativeTime(portfolio.created_at)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {portfolio.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-50 text-blue-500 text-xs sm:text-sm rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <a
            href={portfolio.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          {portfolio.deploy_url && (
            <a
              href={portfolio.deploy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <ExternalLink className="w-4 h-4" />
              라이브 데모
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎯 포트폴리오 콘텐츠 컴포넌트
function PortfolioContent({ content }: { content: string }) {
  const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">{children}</h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="ml-4">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-gray-700">{children}</em>
    ),
    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
      // pre 태그 안의 code는 다르게 스타일링
      const isInPre = className?.includes('language-') || false;
      
      if (isInPre) {
        return (
          <code className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
            {children}
          </code>
        );
      }
      
      return (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {children}
        </code>
      );
    },
    pre: ({ children }: { children: React.ReactNode }) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 [&>code]:block [&>code]:leading-relaxed">
        {children}
      </pre>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 text-gray-700 italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        프로젝트 상세 설명
      </h2>
      <div className="max-w-none text-sm sm:text-base">
        <ReactMarkdown components={markdownComponents as React.ComponentProps<typeof ReactMarkdown>['components']}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
