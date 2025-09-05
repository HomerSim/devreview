import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
  
    try {
        // ✅ Next.js 15: params를 await 해야 함
        const { id } = await params;
        const portfolioId = id;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${portfolioId}`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.API_KEY}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
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
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`;
    
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || '',
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
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${id}`;
    
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
