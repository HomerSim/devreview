import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
  
    try {
        // ✅ Next.js 15: params를 await 해야 함
        const { id } = await params;
        const portfolioId = id;
        
        // 🍪 쿠키에서 토큰 추출
        const token = getAuthTokenFromRequest(req);
        
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${portfolioId}`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.API_KEY}`,
                ...(token && { "Authorization": `Bearer ${token}` })
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}

// 포트폴리오 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`;
    
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || '',
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Portfolio update API error:", errorData);
      
      return NextResponse.json({ 
        error: errorData.detail || 'Failed to update portfolio',
        status: response.status 
      }, { 
        status: response.status 
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// 포트폴리오 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`;
    
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || '',
        ...(token && { "Authorization": `Bearer ${token}` })
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Portfolio delete API error:", errorData);
      
      return NextResponse.json({ 
        error: errorData.detail || 'Failed to delete portfolio',
        status: response.status 
      }, { 
        status: response.status 
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
