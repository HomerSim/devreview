'use client';

import React from 'react';
import { Save, Send } from 'lucide-react';

// Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TechStackSelector } from '@/components/tech-stack-selector';
import { PageHeader } from '@/components/page-header';

// Hooks
import { usePortfolioForm } from '@/hooks/usePortfolioForm';

export default function CreatePortfolioPage() {
  
  const {
    formData,
    selectedTechStack,
    errors,
    isSubmitting,
    updateFormData,
    addTechStack,
    removeTechStack,
    submitForm
  } = usePortfolioForm();

  const handleSubmit = async (isDraft: boolean) => {
    const success = await submitForm(isDraft);
    if (success) {
      // TODO: Navigate to portfolio list or detail page
      // router.push('/feed');
    }
  };

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
    </div>
  );
}
