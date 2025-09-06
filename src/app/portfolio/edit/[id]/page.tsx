'use client';

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

// Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategorySelect } from '@/components/ui/category-select';
import { TechStackSelector } from '@/components/tech-stack-selector';
import { PageHeader } from '@/components/page-header';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { withAuth, useAuth } from '@/hooks/useAuth';

// Constants
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/constants/categories';

interface PortfolioFormData {
  title: string;
  category: PortfolioCategory | '';
  description: string;
  content: string;
  githubUrl: string;
  deployUrl: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  content?: string;
  githubUrl?: string;
  deployUrl?: string;
  techStack?: string;
}

function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const [portfolioId, setPortfolioId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [ownershipError, setOwnershipError] = useState<string>('');
  
  const { user } = useAuth();
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });
  
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    category: '',
    description: '',
    content: '',
    githubUrl: '',
    deployUrl: ''
  });

  // params 처리
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPortfolioId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // 포트폴리오 데이터 로드
  useEffect(() => {
    if (!portfolioId || !user) {
      console.log('🚨 포트폴리오 로드 조건 미충족:', { portfolioId, user });
      return;
    }

    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setOwnershipError('');
        
        console.log('📡 포트폴리오 데이터 로드 시작:', portfolioId);
        
        // 🍪 쿠키 기반: credentials 'include'로 쿠키 자동 전송
        const response = await fetch(`/api/portfolios/${portfolioId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 쿠키 포함
        });
        
        if (!response.ok) {
          console.error('❌ 포트폴리오 API 응답 실패:', response.status, response.statusText);
          if (response.status === 404) {
            setOwnershipError('포트폴리오를 찾을 수 없습니다.');
          } else {
            setOwnershipError('포트폴리오를 불러올 수 없습니다.');
          }
          return;
        }

        const result = await response.json();
        const portfolio = result.data;

        console.log('🔍 소유권 확인 디버깅:', {
          currentUser: user,
          currentUserId: (user as any)?.data?.id || user?.id,
          portfolio: portfolio,
          portfolioUserId: portfolio.user_id,
          portfolioUserObject: portfolio.user,
          portfolioUserObjectId: portfolio.user?.id,
        });

        // 🔒 소유권 확인: 현재 로그인한 사용자와 포트폴리오 작성자가 같은지 확인
        const portfolioUserId = portfolio.user_id || portfolio.user?.id;
        const currentUserId = (user as any)?.data?.id || user?.id;
        console.log('🔒 소유권 비교:', {
          portfolioUserId,
          currentUserId,
          isEqual: portfolioUserId === currentUserId
        });

        if (portfolioUserId !== currentUserId) {
          setOwnershipError('본인의 포트폴리오만 수정할 수 있습니다.');
          setIsOwner(false);
          return;
        }

        setIsOwner(true);
        setFormData({
          title: portfolio.title || '',
          category: portfolio.category || '',
          description: portfolio.description || '',
          content: portfolio.content || '',
          githubUrl: portfolio.github_url || '',
          deployUrl: portfolio.deploy_url || ''
        });
        
        setSelectedTechStack(portfolio.tech_stack || []);
      } catch (err) {
        console.error('Portfolio fetch error:', err);
        setOwnershipError('포트폴리오를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId, user]);

  // 폼 데이터 업데이트
  const updateFormData = (updates: Partial<PortfolioFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // 해당 필드의 에러 제거
    const errorKeys = Object.keys(updates) as (keyof FormErrors)[];
    setErrors(prev => {
      const newErrors = { ...prev };
      errorKeys.forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  // 기술 스택 추가
  const addTechStack = (tech: string) => {
    if (!selectedTechStack.includes(tech)) {
      setSelectedTechStack(prev => [...prev, tech]);
      setErrors(prev => ({ ...prev, techStack: undefined }));
    }
  };

  // 기술 스택 제거
  const removeTechStack = (tech: string) => {
    setSelectedTechStack(prev => prev.filter(t => t !== tech));
  };

  // 폼 유효성 검증
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '프로젝트 제목을 입력해주세요';
    }
    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요';
    }
    if (!formData.description.trim()) {
      newErrors.description = '한 줄 소개를 입력해주세요';
    }
    if (!formData.content.trim()) {
      newErrors.content = '상세 설명을 입력해주세요';
    }
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub URL을 입력해주세요';
    }
    if (selectedTechStack.length === 0) {
      newErrors.techStack = '기술 스택을 최소 1개 이상 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 확인 모달 열기
  const openConfirmModal = () => {
    setConfirmModal({ isOpen: true });
  };

  // 확인 모달 닫기
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false });
  };

  // 실제 제출 처리
  const handleConfirmedSubmit = async () => {
    try {
      setIsSubmitting(true);

      const requestData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        content: formData.content,
        github_url: formData.githubUrl,
        deploy_url: formData.deployUrl,
        tech_stack: selectedTechStack
      };

      // 🍪 쿠키 기반: credentials 'include'로 쿠키 자동 전송
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Portfolio update failed:', errorData);
        throw new Error(`포트폴리오 수정에 실패했습니다. (${response.status})`);
      }

      closeConfirmModal();
      // 수정 완료 후 포트폴리오 상세 페이지로 이동
      window.location.href = `/portfolio/${portfolioId}`;
    } catch (err) {
      console.error('Portfolio update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }
    
    openConfirmModal();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">포트폴리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 🚨 소유권 오류 또는 권한 없음
  if (ownershipError || !isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-3">
              접근 권한이 없습니다
            </h2>
            <p className="text-red-700 mb-6">
              {ownershipError || '본인의 포트폴리오만 수정할 수 있습니다.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                이전 페이지로
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                내 프로필로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const headerActions = (
    <>
      <Button
        onClick={() => handleSubmit()}
        disabled={isSubmitting}
        className="gap-1 sm:gap-2"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isSubmitting ? '수정 중...' : '수정완료'}
        </span>
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="포트폴리오 수정"
        mobileTitle="포트폴리오 수정"
        backHref="/profile"
        actions={headerActions}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 기본 정보 */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              기본 정보
            </h2>
            
            <div className="space-y-6">
              {/* 카테고리 선택 */}
              <CategorySelect
                value={formData.category as PortfolioCategory}
                onChange={(category) => updateFormData({ category })}
                options={PORTFOLIO_CATEGORIES}
                label="카테고리"
                placeholder="카테고리를 선택하세요"
                error={errors.category}
                required
              />

              <Input
                label="프로젝트 제목"
                required
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="예: E-커머스 풀스택 웹사이트"
                error={errors.title}
              />

              <Input
                label="한 줄 소개"
                required
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="프로젝트를 한 줄로 설명해주세요"
                error={errors.description}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="GitHub URL"
                  required
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => updateFormData({ githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repository"
                  error={errors.githubUrl}
                />
                
                <Input
                  label="배포 URL (선택)"
                  type="url"
                  value={formData.deployUrl}
                  onChange={(e) => updateFormData({ deployUrl: e.target.value })}
                  placeholder="https://your-project.vercel.app"
                  error={errors.deployUrl}
                />
              </div>
            </div>
          </Card>

          {/* 기술 스택 */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              기술 스택
            </h2>
            
            <TechStackSelector
              selectedTechStack={selectedTechStack}
              onAddTech={addTechStack}
              onRemoveTech={removeTechStack}
              error={errors.techStack}
            />
          </Card>

          {/* 상세 설명 */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
              상세 설명
            </h2>
            
            <Textarea
              label="프로젝트 상세 설명 (Markdown 형식)"
              value={formData.content}
              onChange={(e) => updateFormData({ content: e.target.value })}
              rows={15}
              placeholder="Markdown 형식으로 프로젝트를 자세히 설명해주세요"
              description="Markdown 문법을 사용할 수 있습니다. (예: **굵게**, *기울임*, `코드`, ## 제목 등)"
              error={errors.content}
            />
          </Card>
        </div>
      </main>

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmedSubmit}
        title="포트폴리오를 수정하시겠습니까?"
        description="수정된 내용이 저장되어 다른 사용자들이 볼 수 있습니다. 수정을 완료하시겠습니까?"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default withAuth(EditPortfolioPage);
