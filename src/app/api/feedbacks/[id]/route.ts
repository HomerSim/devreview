import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenFromRequest } from "@/lib/auth-cookies";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feedbackId = params.id;
    const body = await req.json();

    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);

    console.log(`피드백 수정: ${feedbackId}`, body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/${feedbackId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY!,
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`피드백 수정 실패: ${response.status}`, errorData);
      return NextResponse.json(
        { error: `피드백 수정 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("피드백 수정 에러:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const feedbackId = params.id;

    // 🍪 쿠키에서 토큰 추출
    const token = getAuthTokenFromRequest(req);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/${feedbackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY!,
        ...(token && { "Authorization": `Bearer ${token}` })
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`피드백 삭제 실패: ${response.status}`, errorData);
      return NextResponse.json(
        { error: `피드백 삭제 실패: ${response.status}` },
        { status: response.status }
      );
    }

    console.log('피드백 삭제 성공');
    
    return NextResponse.json({ message: "피드백이 삭제되었습니다." });
  } catch (error) {
    console.error("피드백 삭제 에러:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
