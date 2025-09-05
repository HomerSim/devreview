// 백엔드 API 응답 타입
export interface UserProfileApiResponse {
  success: boolean;
  data: {
    email: string;
    name: string;
    role: "JUNIOR" | "SENIOR";
    image: string;
    id: string;
    is_verified: boolean; 
    created_at: string;
    updated_at: string;
    portfolio_count: number;
    received_feedback_count: number;
    received_like_count: number;
  };
  message: string;
}

// 프론트엔드에서 사용할 사용자 프로필 타입
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "JUNIOR" | "SENIOR";
  image: string;
  isVerified: boolean;
  joinedAt: string;
  updatedAt: string;
  portfolioCount: number;
  totalFeedbackReceived: number;
  totalLikes: number;
}

// 백엔드 포트폴리오 API 응답 타입
export interface UserPortfoliosApiResponse {
  success: boolean;
  data: {
    category: string;
    title: string;
    description: string;
    content: string;
    github_url: string;
    deploy_url: string | null;
    tech_stack: string[];
    id: string;
    user_id: string;
    view_count: number;
    like_count: number;
    feedback_count: number; // 피드백 개수 추가
    created_at: string;
    updated_at: string;
    user: {
      email: string;
      name: string;
      role: "JUNIOR" | "SENIOR";
      image: string;
      id: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
    };
    is_liked: boolean | null;
  }[];
  message: string;
}

// 프론트엔드에서 사용할 포트폴리오 타입
export interface UserPortfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  githubUrl: string;
  deployUrl: string | null;
  viewCount: number;
  likeCount: number;
  feedbackCount: number; // 피드백 개수 추가
  createdAt: string;
  updatedAt: string;
  status: 'published'; // 백엔드에서 받아온 데이터는 모두 게시됨 상태로 처리
}
