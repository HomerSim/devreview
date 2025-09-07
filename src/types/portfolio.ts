import { PortfolioCategory } from '@/constants/categories';

// 🎯 프론트엔드용 폼 데이터 (camelCase)
export interface PortfolioFormData {
  category: PortfolioCategory;
  title: string;
  description: string;
  content: string;
  githubUrl: string;
  deployUrl: string;
  techStack: string[];
}

// 🎯 백엔드 API 요청용 타입 (snake_case)
export interface PortfolioApiRequest {
  category: string;
  title: string;
  description: string;
  content: string;
  github_url: string;
  deploy_url: string;
  tech_stack: string[];
}

export interface FormErrors {
  [key: string]: string;
}

// ✅ PortfolioSubmission 제거 - PortfolioFormData로 통합

// 포트폴리오 상세 정보 타입
export interface PortfolioDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string; // 카테고리 필드 추가
  github_url: string;
  deploy_url: string;
  tech_stack: string[];
  view_count: number;
  like_count: number;
  feedback_count?: number; // 피드백 수 추가
  is_liked?: boolean; // 현재 사용자의 좋아요 상태
  is_owner?: boolean | null; // 백엔드에서 검증된 소유자 여부 (true/false/null)
  created_at: string;
  updated_at: string;
  user_id?: string; // 소유권 확인용 추가
  author_id?: string; // 백엔드에서 다른 이름으로 올 수 있음
  owner_id?: string; // 백엔드에서 다른 이름으로 올 수 있음
  user: {
    name: string;
    id: string;
  } | null; // 사용자가 탈퇴한 경우 null일 수 있음
  author?: { // 백엔드에서 다른 이름으로 올 수 있음
    name: string;
    id: string;
  } | null;
}

// 피드백 타입
export interface Feedback {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user: {
    name: string;
    role: 'SENIOR' | 'JUNIOR';
  } | null; // 사용자가 탈퇴한 경우 null일 수 있음
  like_count: number;
}

// 피드백 API 응답
export interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
}
