import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-oauth-status`;
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
        ...(token && { "Authorization": `Bearer ${token}` })
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Check OAuth status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check OAuth status' },
      { status: 500 }
    );
  }
}
