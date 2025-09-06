import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/disconnect-oauth`;
    
    // 요청 헤더에서 Authorization 토큰 추출
    const authHeader = req.headers.get('authorization');
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
        ...(authHeader && { "Authorization": authHeader })
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Disconnect OAuth error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to disconnect OAuth' },
      { status: 500 }
    );
  }
}
