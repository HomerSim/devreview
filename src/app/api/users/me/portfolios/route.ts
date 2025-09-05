import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // TODO: 실제로는 JWT 토큰에서 사용자 ID를 추출해야 함
    // 현재는 하드코딩된 사용자 ID 사용
    const userId = "9df0af64-9179-43ca-8d9b-f4728223e4b5";
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/portfolios`;
    
    console.log('🔍 Fetching user portfolios from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
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
