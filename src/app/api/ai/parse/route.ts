import { NextRequest, NextResponse } from 'next/server';
import { parseWithGemini, parseWithHeuristics } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let result = null;

    if (apiKey) {
      result = await parseWithGemini(prompt, apiKey);
    }

    if (!result) {
      result = parseWithHeuristics(prompt);
    }

    return NextResponse.json({
      success: true,
      data: result,
      source: apiKey && result ? 'gemini-1.5-cloud' : 'cloud-heuristic-engine',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/ai/parse:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal AI Serverless Error' },
      { status: 500 }
    );
  }
}
