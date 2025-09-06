import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/portfolios`;
    
    // 요청 헤더에서 Authorization 토큰 추출
    const authHeader = req.headers.get('authorization');
    
    console.log('🔍 Fetching user portfolios from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
        ...(authHeader && { "Authorization": authHeader })
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ User portfolios API response:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ User portfolios API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch user portfolios',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
