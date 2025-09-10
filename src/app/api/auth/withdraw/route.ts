import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function DELETE(req: NextRequest) {
  try {
    const token = getAuthTokenFromRequest(req);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/withdraw`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      credentials: "include"
    });

    const data = await response.json();

    // 탈퇴 성공 시 쿠키 삭제
    if (response.ok && data.success) {
      const res = NextResponse.json(data, { status: response.status });
      res.cookies.set("auth_token", "", { path: "/", maxAge: 0 });
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("회원 탈퇴 API 에러:", error);
    return NextResponse.json({ success: false, message: "Internal server error", data: null }, { status: 500 });
  }
}