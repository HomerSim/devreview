import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios?page=${page}&limit=${limit}`;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    console.log("🚀 Creating portfolio with data:", body);

    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend error response:", errorData);
      console.error("❌ Error detail:", errorData.detail);
      return NextResponse.json({ error: 'Failed to create portfolio', detail: errorData.detail }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}