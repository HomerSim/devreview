import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth-cookies';

export async function POST(req: NextRequest) {
  try {
    const { token, user_id } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // 성공 응답 생성
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful'
    });

    // HTTP-Only 쿠키로 토큰 저장
    setAuthCookie(response, token);

    // 사용자 ID도 쿠키에 저장 (선택적)
    if (user_id) {
      response.cookies.set('user_id', user_id, {
        httpOnly: false, // 클라이언트에서 읽을 수 있도록
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Set auth cookie error:', error);
    return NextResponse.json(
      { error: 'Failed to set authentication' },
      { status: 500 }
    );
  }
}
