// 포트폴리오 카테고리 상수
export const TECH_CATEGORIES = [
  '전체', 
  '프론트엔드', 
  '백엔드', 
  '풀스택',
  '모바일', 
  'DevOps', 
  'AI/ML',
  '데이터사이언스',
  '게임개발',
  '보안',
  '블록체인',
  '클라우드'
] as const;

// '전체'를 제외한 실제 카테고리 목록 (등록 시 사용)
export const PORTFOLIO_CATEGORIES = TECH_CATEGORIES.filter(category => category !== '전체');

// 타입 정의
export type TechCategory = typeof TECH_CATEGORIES[number];
export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];
