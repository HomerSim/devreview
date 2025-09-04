import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
  
    try {
        const portfolioId = params.id;
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/portfolios/${portfolioId}`;
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
        
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}
