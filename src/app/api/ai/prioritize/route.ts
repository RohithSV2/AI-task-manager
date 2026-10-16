import { NextRequest, NextResponse } from 'next/server';
import { Task, EisenhowerQuadrant } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { tasks } = await req.json() as { tasks: Task[] };

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    const updatedTasks = tasks.map(task => {
      let quadrant: EisenhowerQuadrant = task.eisenhowerQuadrant;
      const isUrgent = task.priority === 'urgent' || (task.dueDate && new Date(task.dueDate).getTime() - Date.now() < 86400000 * 2);
      const isImportant = task.category === 'Cloud Computing' || task.category === 'Architecture' || task.priority === 'high' || task.priority === 'urgent';

      if (isUrgent && isImportant) {
        quadrant = 'q1_urgent_important';
      } else if (!isUrgent && isImportant) {
        quadrant = 'q2_not_urgent_important';
      } else if (isUrgent && !isImportant) {
        quadrant = 'q3_urgent_not_important';
      } else {
        quadrant = 'q4_not_urgent_not_important';
      }

      const urgencyScore = isUrgent ? 50 : 20;
      const importanceScore = isImportant ? 40 : 15;
      const complexityScore = task.aiComplexityScore || Math.min(95, urgencyScore + importanceScore);

      return {
        ...task,
        eisenhowerQuadrant: quadrant,
        aiComplexityScore: complexityScore,
        aiInsight: `Auto-prioritized: Placed into ${quadrant.replace('q1_', 'Q1: ').replace('q2_', 'Q2: ').replace('q3_', 'Q3: ').replace('q4_', 'Q4: ')}. Focus on Q1 tasks first.`
      };
    });

    return NextResponse.json({
      success: true,
      tasks: updatedTasks,
      totalAnalyzed: updatedTasks.length,
      distribution: {
        q1: updatedTasks.filter(t => t.eisenhowerQuadrant === 'q1_urgent_important').length,
        q2: updatedTasks.filter(t => t.eisenhowerQuadrant === 'q2_not_urgent_important').length,
        q3: updatedTasks.filter(t => t.eisenhowerQuadrant === 'q3_urgent_not_important').length,
        q4: updatedTasks.filter(t => t.eisenhowerQuadrant === 'q4_not_urgent_not_important').length,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Prioritization calculation failed' },
      { status: 500 }
    );
  }
}
