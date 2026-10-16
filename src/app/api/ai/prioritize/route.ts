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
      const daysUntilDue = task.dueDate ? (new Date(task.dueDate).getTime() - Date.now()) / 86400000 : 5;
      const isUrgent = task.priority === 'urgent' || daysUntilDue <= 2;
      const isImportant = task.priority === 'high' || task.priority === 'urgent' || task.category === 'Work' || task.category === 'Study';

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

      const quadrantNames: Record<EisenhowerQuadrant, string> = {
        q1_urgent_important: 'Q1 (Do First)',
        q2_not_urgent_important: 'Q2 (Schedule / Focus)',
        q3_urgent_not_important: 'Q3 (Delegate / Quick Win)',
        q4_not_urgent_not_important: 'Q4 (Backlog / Low Priority)'
      };

      return {
        ...task,
        eisenhowerQuadrant: quadrant,
        aiComplexityScore: complexityScore,
        aiInsight: `Auto-sorted into ${quadrantNames[quadrant]}. Tackle high-leverage Q1 and Q2 items first.`
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
