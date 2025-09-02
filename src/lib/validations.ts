import { PortfolioFormData, FormErrors } from '@/types/portfolio';
import { isValidUrl } from '@/lib/utils';

export const validatePortfolioForm = (
  formData: PortfolioFormData,
  techStack: string[],
  isDraft: boolean
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!isDraft) {
    // 필수 필드 검증 (게시할 때만)
    if (!formData.title.trim()) {
      errors.title = '프로젝트 제목을 입력해주세요.';
    }

    if (!formData.description.trim()) {
      errors.description = '한 줄 소개를 입력해주세요.';
    }

    if (!formData.githubUrl.trim()) {
      errors.githubUrl = 'GitHub URL을 입력해주세요.';
    }

    if (techStack.length === 0) {
      errors.techStack = '최소 1개의 기술 스택을 선택해주세요.';
    }
  }

  // URL 형식 검증 (항상)
  if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
    errors.githubUrl = '올바른 URL 형식을 입력해주세요.';
  }

  if (formData.deployUrl && !isValidUrl(formData.deployUrl)) {
    errors.deployUrl = '올바른 URL 형식을 입력해주세요.';
  }

  // GitHub URL 도메인 검증
  if (formData.githubUrl && isValidUrl(formData.githubUrl)) {
    try {
      const url = new URL(formData.githubUrl);
      if (!url.hostname.includes('github.com')) {
        errors.githubUrl = 'GitHub URL을 입력해주세요.';
      }
    } catch {
      // isValidUrl에서 이미 처리됨
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
