import { NextRequest, NextResponse } from 'next/server';
import { initialTasks } from '@/lib/default-tasks';
import { Task } from '@/types';
import { generateId } from '@/lib/utils';

// In-memory runtime cache for serverless invocation demonstration
let serverlessTasksStore: Task[] = [...initialTasks];

export async function GET() {
  return NextResponse.json({
    success: true,
    tasks: serverlessTasksStore,
    total: serverlessTasksStore.length,
    timestamp: new Date().toISOString(),
    cloudRegion: process.env.VERCEL_REGION || 'iad1 (AWS us-east-1)'
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newTask: Task = {
      id: data.id || generateId(),
      title: data.title || 'Untitled Task',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: data.status || 'todo',
      category: data.category || 'Cloud Computing',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      estimatedHours: Number(data.estimatedHours) || 2,
      actualHours: Number(data.actualHours) || 0,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      tags: Array.isArray(data.tags) ? data.tags : ['Cloud'],
      cloudResource: data.cloudResource || 'AWS Lambda / Vercel Edge',
      eisenhowerQuadrant: data.eisenhowerQuadrant || 'q2_not_urgent_important',
      aiSuggested: Boolean(data.aiSuggested),
      aiComplexityScore: data.aiComplexityScore || 50,
      aiInsight: data.aiInsight || 'Created via Serverless API',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    serverlessTasksStore.unshift(newTask);

    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Task created on Cloud Serverless Datastore'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create task' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const index = serverlessTasksStore.findIndex(t => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    serverlessTasksStore[index] = {
      ...serverlessTasksStore[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      task: serverlessTasksStore[index]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update task' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID query param is required' }, { status: 400 });
    }

    const initialLength = serverlessTasksStore.length;
    serverlessTasksStore = serverlessTasksStore.filter(t => t.id !== id);

    return NextResponse.json({
      success: true,
      deletedId: id,
      count: initialLength - serverlessTasksStore.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete task' }, { status: 400 });
  }
}
