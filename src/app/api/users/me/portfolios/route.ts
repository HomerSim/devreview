import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/portfolios`;
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);
    
    console.log('🔍 Fetching user portfolios from:', apiUrl);
    console.log('🔑 Token from cookie:', token ? 'Present' : 'Missing');
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
        ...(token && { "Authorization": `Bearer ${token}` })
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
