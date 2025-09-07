import { create } from 'zustand';

interface PortfolioLikeData {
  likeCount: number;
  isLiked: boolean;
}

interface PortfolioStore {
  // 포트폴리오별 좋아요 상태 저장
  portfolios: Record<string, PortfolioLikeData>;
  
  // 포트폴리오 초기화 (서버에서 받은 데이터로)
  initializePortfolio: (id: string, likeCount: number, isLiked: boolean) => void;
  
  // 좋아요 상태 업데이트
  updateLikeStatus: (id: string, likeCount: number, isLiked: boolean) => void;
  
  // 특정 포트폴리오 데이터 가져오기
  getPortfolio: (id: string) => PortfolioLikeData;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolios: {},
  
  initializePortfolio: (id, likeCount, isLiked) => {
    // 🔧 이미 존재하는 데이터가 동일하면 업데이트하지 않음 (불필요한 리렌더링 방지)
    const existing = get().portfolios[id];
    if (existing && existing.likeCount === likeCount && existing.isLiked === isLiked) {
      return;
    }
    
    set((state) => ({
      portfolios: {
        ...state.portfolios,
        [id]: { likeCount, isLiked }
      }
    }));
  },
    
  updateLikeStatus: (id, likeCount, isLiked) => {
    set((state) => ({
      portfolios: {
        ...state.portfolios,
        [id]: { likeCount, isLiked }
      }
    }));
  },
  
  getPortfolio: (id) => {
    const portfolio = get().portfolios[id];
    return portfolio || { likeCount: 0, isLiked: false };
  },
}));

// 🎯 커스텀 훅 - 특정 포트폴리오의 좋아요 상태만 구독 (단순화)
export const usePortfolioLike = (portfolioId: string) => {
  // 🔧 전체 스토어를 구독하되 필요한 값만 반환
  const portfolios = usePortfolioStore((state) => state.portfolios);
  
  // 🔧 해당 포트폴리오의 데이터 반환 (기본값 포함)
  return portfolios[portfolioId] || { likeCount: 0, isLiked: false };
};
