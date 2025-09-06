import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-cookies';

export async function POST() {
  try {
    // 성공 응답 생성
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // 인증 쿠키 삭제
    clearAuthCookie(response);

    // 사용자 ID 쿠키도 삭제
    response.cookies.set('user_id', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
