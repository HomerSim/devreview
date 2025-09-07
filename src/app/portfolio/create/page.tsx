'use client';

import React, { useState } from 'react';
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

// Hooks
import { usePortfolioForm } from '@/hooks/usePortfolioForm';
import { withAuth } from '@/hooks/useAuth';

// Constants
import { PORTFOLIO_CATEGORIES } from '@/constants/categories';

function CreatePortfolioPage() {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });
  
  const {
    formData,
    selectedTechStack,
    errors,
    isSubmitting,
    updateFormData,
    addTechStack,
    removeTechStack,
    validateForm,
    submitForm
  } = usePortfolioForm();

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
    const success = await submitForm();
    if (success) {
      closeConfirmModal();
    }
  };

  const handleSubmit = async () => {
    // 1단계: 먼저 유효성 검증 수행
    const isValid = validateForm();
    
    // 검증 실패 시 확인 모달 없이 바로 종료 (에러는 이미 표시됨)
    if (!isValid) {
      console.log('❌ 유효성 검증 실패 - 모달 표시 안함');
      return;
    }
    
    // 2단계: 검증 통과 시에만 확인 모달 열기
    openConfirmModal();
  };

  const headerActions = (
    <>
      <Button
        onClick={() => handleSubmit()}
        disabled={isSubmitting}
        className="gap-1 sm:gap-2"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isSubmitting ? '게시 중...' : '게시하기'}
        </span>
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="포트폴리오 만들기"
        mobileTitle="포트폴리오"
        backHref="/feed"
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
                value={formData.category}
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
        title="포트폴리오를 게시하시겠습니까?"
        description="포트폴리오가 게시되어 다른 사용자들이 볼 수 있습니다. 게시하시겠습니까?"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default withAuth(CreatePortfolioPage);
