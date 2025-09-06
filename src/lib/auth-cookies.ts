import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 서버 컴포넌트에서 쿠키 읽기
export async function getAuthTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// API Route에서 쿠키 설정
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: '/',
  });
  return response;
}

// API Route에서 쿠키 삭제
export function clearAuthCookie(response: NextResponse) {
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}

// API Route에서 요청 쿠키 읽기
export function getAuthTokenFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get('auth_token')?.value;
}
