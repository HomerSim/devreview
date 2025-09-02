import { useState, useCallback } from 'react';
import { PortfolioFormData, FormErrors, PortfolioSubmission } from '@/types/portfolio';
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
    
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    description: '',
    githubUrl: '',
    deployUrl: '',
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

  const submitForm = useCallback(async (isDraft: boolean): Promise<boolean> => {
    const validation = validatePortfolioForm(formData, selectedTechStack, isDraft);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const portfolioData: PortfolioSubmission = {
        ...formData,
        techStack: selectedTechStack,
        isDraft
      };

      console.log(isDraft ? '임시저장:' : '게시:', portfolioData);

      // TODO: API 호출
      // const response = await fetch('/api/portfolio', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(portfolioData),
      // });
      
      // if (!response.ok) throw new Error('제출에 실패했습니다.');

      // 임시 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(isDraft ? '임시저장되었습니다!' : '포트폴리오가 게시되었습니다!');
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
    submitForm
  };
};
