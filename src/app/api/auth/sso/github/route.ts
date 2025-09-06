import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sso/github`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${process.env.API_KEY}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
