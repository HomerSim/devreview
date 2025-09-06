import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

// 내정보 수정
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`;

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
      console.error("❌ User update API error:", errorData);

      return NextResponse.json({
        error: errorData.detail || 'Failed to update user',
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
