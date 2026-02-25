import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages, model } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured on server.' }, { status: 500 });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://biopharma-agent-demo.ai',
                'X-Title': 'BioPharma AI Program',
            },
            body: JSON.stringify({
                model: model || 'openrouter/auto',
                messages,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json({
                error: `OpenRouter Error: ${response.status} ${response.statusText}`,
                details: errorData
            }, { status: response.status });
        }

        // Stream the response
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
