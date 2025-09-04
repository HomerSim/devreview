import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // 백엔드 스펙에 맞는 URL 사용
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/portfolios/${id}/feedbacks?page=${page}&limit=${limit}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Feedbacks API error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    body.portfolio_id = id; // 포트폴리오 ID 추가
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });


    if (!response.ok) {
      const errorData = await response.json(); // 🎯 이 부분이 중요!
      console.error("❌ Backend error response:", errorData);
      console.error("❌ Error detail:", errorData.detail);
      
      // 클라이언트에게 구체적인 에러 메시지 전달
      return NextResponse.json({ 
        error: errorData.detail || 'Failed to create feedback',
        status: response.status 
      }, { 
        status: response.status 
      });

    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Create feedback error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
