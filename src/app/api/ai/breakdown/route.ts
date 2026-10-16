import { NextRequest, NextResponse } from 'next/server';
import { generateSmartSubtasks } from '@/lib/ai-engine';
import { TaskCategory } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { title, description, category } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    const subtasks = generateSmartSubtasks(title, (category as TaskCategory) || 'Cloud Computing');

    return NextResponse.json({
      success: true,
      subtasks,
      aiSummary: `AI generated ${subtasks.length} optimized sub-phases with balanced time allocations.`,
      recommendedDurationMinutes: subtasks.reduce((acc, s) => acc + (s.estimatedMinutes || 0), 0)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Serverless Breakdown Failed' },
      { status: 500 }
    );
  }
}
