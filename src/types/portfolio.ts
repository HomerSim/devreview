export interface PortfolioFormData {
  title: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
  content: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface PortfolioSubmission extends PortfolioFormData {
  techStack: string[];
  isDraft: boolean;
}

// 포트폴리오 상세 정보 타입
export interface PortfolioDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  github_url: string;
  deploy_url: string;
  tech_stack: string[];
  view_count: number;
  like_count: number;
  is_liked?: boolean; // 현재 사용자의 좋아요 상태
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    id: string;
  };
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
  };
  like_count: number;
}

// 피드백 API 응답
export interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
}
