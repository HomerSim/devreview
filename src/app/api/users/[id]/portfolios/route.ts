import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
  
    try {
        // ✅ Next.js 15: params를 await 해야 함
        const { id } = await params;
        const userId = id;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/portfolios`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.API_KEY}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (_error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}
