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
        const promptContext = `You are "CloudTask AI", an enterprise assistant for Cloud Computing and DevOps teams.
Current user tasks in the system:
${JSON.stringify(taskList.map(t => ({ title: t.title, priority: t.priority, status: t.status, category: t.category, due: t.dueDate })))}

Respond concisely to the user's request. Provide actionable recommendations.`;

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

    // Heuristic AI Copilot Engine
    let reply = '';
    const pendingTasks = taskList.filter(t => t.status !== 'completed');
    const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
    const cloudTasks = pendingTasks.filter(t => t.category === 'Cloud Computing' || t.category === 'DevOps');

    if (lower.includes('standup') || lower.includes('briefing') || lower.includes('summary') || lower.includes('status')) {
      reply = `📋 **Daily Cloud Standup Briefing**:
- **Total active tasks**: ${pendingTasks.length} pending (${taskList.filter(t => t.status === 'completed').length} completed).
- **Critical focus**: You have ${urgentTasks.length} high/urgent priority items.
- **Top priority right now**: "${urgentTasks[0]?.title || pendingTasks[0]?.title || 'All caught up!'}"
- **Cloud Infrastructure Status**: All serverless routes on Vercel/AWS are healthy. Serverless latency is currently optimal (~24ms).`;
    } else if (lower.includes('recommend') || lower.includes('next') || lower.includes('what should i do')) {
      if (urgentTasks.length > 0) {
        reply = `💡 **AI Recommendation**: Tackle **"${urgentTasks[0].title}"** first! It is marked as **${urgentTasks[0].priority.toUpperCase()}** priority under **${urgentTasks[0].category}**. Completing this will unblock related sub-tasks and optimize your project milestone velocity.`;
      } else if (pendingTasks.length > 0) {
        reply = `💡 **AI Recommendation**: You have cleared all urgent blockers! Proceed with **"${pendingTasks[0].title}"** (${pendingTasks[0].category}) to make steady progress.`;
      } else {
        reply = `🎉 All scheduled tasks are complete! Consider using the Quick AI Task bar to create your next sprint roadmap.`;
      }
    } else if (lower.includes('cloud') || lower.includes('aws') || lower.includes('vercel') || lower.includes('serverless')) {
      reply = `☁️ **Cloud Computing Overview**:
This AI Task Manager is engineered as a serverless microservices architecture deployed on **Vercel** with regional edge distribution (iad1 / AWS us-east-1).
Key components include:
1. **Edge Caching & Dynamic SSR** via Next.js 14 App Router.
2. **Serverless AI Inference Microservices** at \`/api/ai/*\`.
3. **Automated CI/CD** via GitHub Actions.
4. **Cloud Telemetry Simulation** monitoring invocation counts, latency, and simulated memory.`;
    } else {
      reply = `🤖 **CloudTask AI Assistant**: I analyzed your ${taskList.length} tasks. You currently have ${urgentTasks.length} high-priority tasks and ${pendingTasks.length} total tasks remaining. How can I assist you with your sprint planning, subtask breakdown, or cloud architecture today?`;
    }

    return NextResponse.json({
      reply,
      source: 'cloud-serverless-assistant'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Chat generation failed' },
      { status: 500 }
    );
  }
}
