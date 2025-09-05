'use client';

import React, { useState, useEffect } from 'react';
import { Save, Send } from 'lucide-react';

// Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategorySelect } from '@/components/ui/category-select';
import { TechStackSelector } from '@/components/tech-stack-selector';
import { PageHeader } from '@/components/page-header';
import { ConfirmModal } from '@/components/ui/confirm-modal';

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

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const [portfolioId, setPortfolioId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    isDraft: boolean;
  }>({ isOpen: false, isDraft: false });
  
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
    if (!portfolioId) return;

    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/portfolios/${portfolioId}`);
        
        if (!response.ok) {
          throw new Error('포트폴리오를 불러올 수 없습니다.');
        }

        const result = await response.json();
        const portfolio = result.data;

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

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
  const validateForm = (isDraft: boolean): boolean => {
    const newErrors: FormErrors = {};

    if (!isDraft) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 확인 모달 열기
  const openConfirmModal = (isDraft: boolean) => {
    setConfirmModal({ isOpen: true, isDraft });
  };

  // 확인 모달 닫기
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, isDraft: false });
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

      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('포트폴리오 수정에 실패했습니다.');
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

  const handleSubmit = async (isDraft: boolean) => {
    const isValid = validateForm(isDraft);
    
    if (!isValid) {
      return;
    }
    
    openConfirmModal(isDraft);
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

  const headerActions = (
    <>
      <Button
        variant="ghost"
        onClick={() => handleSubmit(true)}
        disabled={isSubmitting}
        className="gap-1 sm:gap-2"
      >
        <Save className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isSubmitting ? '저장 중...' : '임시저장'}
        </span>
      </Button>
      <Button
        onClick={() => handleSubmit(false)}
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
        title={confirmModal.isDraft ? '임시저장 하시겠습니까?' : '포트폴리오를 수정하시겠습니까?'}
        description={
          confirmModal.isDraft 
            ? '작성 중인 내용을 임시저장합니다. 언제든지 다시 편집할 수 있습니다.'
            : '수정된 내용이 저장되어 다른 사용자들이 볼 수 있습니다. 수정을 완료하시겠습니까?'
        }
        isLoading={isSubmitting}
        isDraft={confirmModal.isDraft}
      />
    </div>
  );
}
