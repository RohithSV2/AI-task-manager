import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { message, tasks, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const taskList = (tasks as Task[]) || [];
    const lower = message.toLowerCase();

    // Check if Gemini API Key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const promptContext = `You are "TaskMaster AI", a world-class personal productivity assistant and executive coach.
User's current task list:
${JSON.stringify(taskList.map(t => ({ title: t.title, priority: t.priority, status: t.status, category: t.category, due: t.dueDate })))}

Help the user plan their day, prioritize effectively, overcome procrastination, or break down difficult projects. Keep responses clear, actionable, and formatted in markdown.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${promptContext}\n\nUser Question: ${message}` }] }]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              source: 'gemini-cloud'
            });
          }
        }
      } catch (e) {
        console.error('Gemini chat failed, fallback to heuristic response', e);
      }
    }

    // Heuristic Productivity Copilot
    let reply = '';
    const pendingTasks = taskList.filter(t => t.status !== 'completed');
    const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
    const completedTasks = taskList.filter(t => t.status === 'completed');

    if (lower.includes('standup') || lower.includes('briefing') || lower.includes('plan my day') || lower.includes('summary')) {
      reply = `☀️ **Daily Productivity Briefing**:
- **Pending Tasks**: ${pendingTasks.length} items to complete (${completedTasks.length} already finished!).
- **Urgent / High Priority**: ${urgentTasks.length} tasks need your immediate attention.
- **Recommended First Action**: Start with **"${urgentTasks[0]?.title || pendingTasks[0]?.title || 'All caught up!'}"**.
- **Pro Tip**: Use 25-minute Pomodoro focus blocks to maintain peak mental energy without burnout.`;
    } else if (lower.includes('recommend') || lower.includes('next') || lower.includes('what should i do')) {
      if (urgentTasks.length > 0) {
        reply = `🎯 **Top Recommendation**: Focus on **"${urgentTasks[0].title}"** (${urgentTasks[0].category}).
It has **${urgentTasks[0].priority.toUpperCase()}** priority and is due on **${urgentTasks[0].dueDate || 'soon'}**. Knocking this out first will give you massive peace of mind!`;
      } else if (pendingTasks.length > 0) {
        reply = `🎯 **Top Recommendation**: You have cleared all urgent fires! Dive into **"${pendingTasks[0].title}"** (${pendingTasks[0].category}) to make meaningful progress on your long-term goals.`;
      } else {
        reply = `🎉 Incredible work! You've completed all tasks on your board. Take a well-deserved break or use the Quick AI Task bar to brainstorm your next big project!`;
      }
    } else if (lower.includes('prioritize') || lower.includes('matrix') || lower.includes('eisenhower')) {
      reply = `⚖️ **Task Prioritization Matrix**:
- **Q1 (Urgent & Important)**: Focus on pressing deadlines and critical commitments first.
- **Q2 (Not Urgent & Important)**: This is where true growth happens (learning, health, strategic planning). Block distraction-free time for these.
- **Q3 (Urgent, Not Important)**: Try to batch or delegate minor requests.
- **Q4 (Neither)**: Minimize or archive these to free up mental clarity.`;
    } else {
      reply = `👋 **TaskMaster AI**: I reviewed your ${taskList.length} tasks (${pendingTasks.length} active, ${urgentTasks.length} high priority). 

I can help you:
1. **Plan your day** with a custom morning or evening briefing.
2. **Break down a challenging task** into bite-sized steps.
3. **Re-prioritize your workload** based on upcoming deadlines.

How can I help you be productive today?`;
    }

    return NextResponse.json({
      reply,
      source: 'smart-productivity-assistant'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Chat generation failed' },
      { status: 500 }
    );
  }
}
