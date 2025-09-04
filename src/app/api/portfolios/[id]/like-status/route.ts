import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    
    console.log('🔍 좋아요 상태 확인 요청:', {
      portfolioId: id,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')
    });

    // 실제 백엔드 API에 좋아요 상태 확인 요청
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}/like-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || '',
        // 🔄 캐시 무효화 헤더들
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!backendResponse.ok) {
      console.error('❌ 백엔드 좋아요 상태 확인 실패:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        portfolioId: id
      });
      
      return NextResponse.json(
        { 
          error: '좋아요 상태를 확인할 수 없습니다.',
          details: `Backend returned ${backendResponse.status}`
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    
    console.log('✅ 좋아요 상태 확인 성공:', {
      portfolioId: id,
      isLiked: data.is_liked,
      likeCount: data.like_count,
      timestamp: new Date().toISOString()
    });

    // 🚨 캐시 방지 헤더와 함께 응답
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('❌ 좋아요 상태 확인 중 예외 발생:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
