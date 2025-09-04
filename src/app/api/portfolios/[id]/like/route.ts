import { NextRequest, NextResponse } from "next/server";

// 좋아요 추가
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}/like`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || '',
        // 🔄 캐시 무효화 헤더들
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Like API error:", errorData);
      
      return NextResponse.json({ 
        error: errorData.detail || 'Failed to like portfolio',
        status: response.status 
      }, { 
        status: response.status 
      });
    }

    const data = await response.json();
    
    // 🚨 캐시 방지 헤더와 함께 응답
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error("Like portfolio error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 좋아요 취소
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}/like`;
    
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || '',
        // 🔄 캐시 무효화 헤더들
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Unlike API error:", errorData);
      
      return NextResponse.json({ 
        error: errorData.detail || 'Failed to unlike portfolio',
        status: response.status 
      }, { 
        status: response.status 
      });
    }

    const data = await response.json();
    
    // 🚨 캐시 방지 헤더와 함께 응답  
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error("Unlike portfolio error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
