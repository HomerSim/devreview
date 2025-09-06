// 인증이 필요한 API 호출을 위한 공통 함수
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  
  // 토큰이 없으면 에러 (선택적)
  if (!token) {
    throw new Error('Authentication required. Please login first.');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// 옵셔널 인증 (토큰이 있으면 포함, 없어도 요청 진행)
export async function optionalAuthFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
