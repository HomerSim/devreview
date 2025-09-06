import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);
    
    console.log('🔍 Fetching current user from:', apiUrl);
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
      console.error('❌ Auth me API error:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Current user data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get current user' },
      { status: 500 }
    );
  }
}