// API 응답 타입 정의
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'JUNIOR' | 'SENIOR';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  content: string;
  githubUrl: string;
  deployUrl: string | null;
  techStack: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  feedbacks: Feedback[];
  feedbackCount?: number;
  likes?: number;
  views?: number;
}

export interface Feedback {
  id: string;
  content: string;
  likes: number;
  authorId: string;
  portfolioId: string;
  createdAt: string;
  author: User;
  portfolio?: Portfolio;
}

// API 요청 타입 정의
export interface CreatePortfolioRequest {
  title: string;
  description: string;
  content: string;
  githubUrl: string;
  deployUrl?: string;
  techStack: string[];
}

export interface CreateFeedbackRequest {
  content: string;
  portfolioId: string;
  rating?: number;
}

export interface UpdateUserRequest {
  name?: string;
  image?: string;
}

export interface VerificationRequest {
  linkedinUrl: string;
  careerDescription: string;
  companyName: string;
  position: string;
  experience: string;
}

// API 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
