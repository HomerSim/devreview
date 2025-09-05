import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioFormData, FormErrors } from '@/types/portfolio';
import { validatePortfolioForm } from '@/lib/validations';

const MARKDOWN_TEMPLATE = `## 프로젝트 소개
프로젝트의 배경과 목적을 설명해주세요.

## 주요 기능
- 기능 1: 설명
- 기능 2: 설명  
- 기능 3: 설명

## 기술적 도전과 해결 과정
개발 중 마주한 기술적 문제와 해결 방법을 구체적으로 설명해주세요.

## 궁금한 점
시니어 개발자에게 특별히 피드백받고 싶은 부분이 있다면 적어주세요.`;

export const usePortfolioForm = () => {
  const router = useRouter();
    
  const [formData, setFormData] = useState<PortfolioFormData>({
    category: '프론트엔드', // 기본값을 '프론트엔드'로 변경
    title: '',
    description: '',
    githubUrl: '',
    deployUrl: '',
    techStack: [],
    content: MARKDOWN_TEMPLATE
  });

  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((updates: Partial<PortfolioFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // 입력 시 해당 필드의 에러 제거
    if (errors) {
      const newErrors = { ...errors };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  }, [errors]);

  const addTechStack = useCallback((tech: string) => {
    if (!selectedTechStack.includes(tech)) {
      setSelectedTechStack(prev => [...prev, tech]);
      // 기술 스택 에러 제거
      if (errors.techStack) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.techStack;
          return newErrors;
        });
      }
    }
  }, [selectedTechStack, errors.techStack]);

  const removeTechStack = useCallback((tech: string) => {
    setSelectedTechStack(prev => prev.filter(t => t !== tech));
  }, []);

  // 🎯 유효성 검증만 수행하는 함수 (모달 표시용)
  const validateForm = useCallback((isDraft: boolean): boolean => {
    const validation = validatePortfolioForm(formData, selectedTechStack, isDraft);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    // 검증 통과 시 에러 클리어
    setErrors({});
    return true;
  }, [formData, selectedTechStack]);

  const submitForm = useCallback(async (isDraft: boolean): Promise<boolean> => {
    const validation = validatePortfolioForm(formData, selectedTechStack, isDraft);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 🔄 백엔드 API 형식으로 변환 (camelCase → snake_case)
      const portfolioData = {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        github_url: formData.githubUrl,    // camelCase → snake_case
        deploy_url: formData.deployUrl,    // camelCase → snake_case
        tech_stack: selectedTechStack,     // camelCase → snake_case
      };

      console.log('🚀 Creating portfolio with data:', portfolioData);

      // ✅ Next.js API Route 사용 (api/portfolios/route.ts의 POST)
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      });

      console.log('Response:', response);

      if (!response.ok) throw new Error('제출에 실패했습니다.');

      // 성공 시 피드 페이지로 리디렉션
      const result = await response.json();
      console.log('✅ 포트폴리오 등록 성공:', result);
      
      // 피드 페이지로 부드럽게 이동
      router.push('/feed');
      return true;

    } catch (error) {
      console.error('Submit error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedTechStack]);

  return {
    formData,
    selectedTechStack,
    errors,
    isSubmitting,
    updateFormData,
    addTechStack,
    removeTechStack,
    validateForm,
    submitForm
  };
};
