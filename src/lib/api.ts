import {
  ApiResponse,
  PaginatedResponse,
  User,
  Portfolio,
  Feedback,
  CreatePortfolioRequest,
  CreateFeedbackRequest,
  UpdateUserRequest,
  VerificationRequest,
} from '@/types/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 기본 헤더 설정
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // 인증 토큰 추가
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // 401 에러 처리 (인증 실패)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        throw new Error('Unauthorized');
      }

      // 응답이 실패한 경우
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // JSON 응답 파싱
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // 인증 관련 API
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { 
    email: string; 
    password: string; 
    name: string; 
    role: 'JUNIOR' | 'SENIOR' 
  }): Promise<ApiResponse<User>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    const result = await this.request<ApiResponse<null>>('/auth/logout', {
      method: 'POST',
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    
    return result;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me');
  }

  // SSO 인증 관련 API
  async getSSOAuthUrl(provider: 'google' | 'github'): Promise<string> {
    const response = await this.request<ApiResponse<{ authUrl: string }>>(`/auth/sso/${provider}`);
    return response.data?.authUrl || '';
  }

  // 사용자 관련 API
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${userId}`);
  }

  // 포트폴리오 관련 API
  async getPortfolios(page = 1, limit = 12, search?: string): Promise<PaginatedResponse<Portfolio>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    return this.request(`/portfolios?${params}`);
  }

  async getPortfolioById(id: string): Promise<ApiResponse<Portfolio>> {
    return this.request(`/portfolios/${id}`);
  }

  async createPortfolio(portfolioData: CreatePortfolioRequest): Promise<ApiResponse<Portfolio>> {
    return this.request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  }

  async updatePortfolio(id: string, portfolioData: Partial<CreatePortfolioRequest>): Promise<ApiResponse<Portfolio>> {
    return this.request(`/portfolios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(portfolioData),
    });
  }

  async deletePortfolio(id: string): Promise<ApiResponse<null>> {
    return this.request(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserPortfolios(userId: string): Promise<ApiResponse<Portfolio[]>> {
    return this.request(`/users/${userId}/portfolios`);
  }

  // 피드백 관련 API
  async getPortfolioFeedbacks(portfolioId: string): Promise<ApiResponse<Feedback[]>> {
    return this.request(`/portfolios/${portfolioId}/feedbacks`);
  }

  async createFeedback(feedbackData: CreateFeedbackRequest): Promise<ApiResponse<Feedback>> {
    return this.request('/feedbacks', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async likeFeedback(feedbackId: string): Promise<ApiResponse<Feedback>> {
    return this.request(`/feedbacks/${feedbackId}/like`, {
      method: 'POST',
    });
  }

  async unlikeFeedback(feedbackId: string): Promise<ApiResponse<Feedback>> {
    return this.request(`/feedbacks/${feedbackId}/like`, {
      method: 'DELETE',
    });
  }

  // 시니어 인증 관련 API
  async submitVerification(verificationData: VerificationRequest): Promise<ApiResponse<null>> {
    return this.request('/verification/submit', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async uploadVerificationFile(file: File): Promise<ApiResponse<{ fileUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/verification/upload', {
      method: 'POST',
      headers: {}, // FormData는 Content-Type을 자동 설정하므로 비워둠
      body: formData,
    });
  }

  // 통계 관련 API
  async getUserStats(userId: string): Promise<ApiResponse<{
    totalPortfolios: number;
    totalFeedbacks: number;
    totalLikes: number;
    responseRate: number;
  }>> {
    return this.request(`/users/${userId}/stats`);
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 개별 함수로도 export (구조 분해 할당으로 사용 가능)
export const {
  login,
  register,
  logout,
  getCurrentUser,
  updateUser,
  getUserProfile,
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getUserPortfolios,
  getPortfolioFeedbacks,
  createFeedback,
  likeFeedback,
  unlikeFeedback,
  submitVerification,
  uploadVerificationFile,
  getUserStats,
} = apiClient;
