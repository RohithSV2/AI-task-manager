export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';

export type TaskCategory = 'Cloud Computing' | 'DevOps' | 'AI & ML' | 'Architecture' | 'General';

export type EisenhowerQuadrant = 'q1_urgent_important' | 'q2_not_urgent_important' | 'q3_urgent_not_important' | 'q4_not_urgent_not_important';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string; // ISO date string or YYYY-MM-DD
  estimatedHours: number;
  actualHours?: number;
  subtasks: Subtask[];
  tags: string[];
  eisenhowerQuadrant: EisenhowerQuadrant;
  aiSuggested?: boolean;
  aiComplexityScore?: number; // 1-100
  aiInsight?: string;
  cloudResource?: string; // e.g. "AWS Lambda", "S3 Bucket", "DynamoDB"
  createdAt: string;
  updatedAt: string;
}

export interface CloudMetric {
  region: string;
  latencyMs: number;
  memoryUsageMb: number;
  cpuLoadPercent: number;
  activeRequests: number;
  serverlessInvocationsToday: number;
  cacheHitRatio: number;
  estimatedCloudCostUsd: number;
  timestamp: string;
}

export interface CloudLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'METRIC';
  service: string;
  message: string;
  durationMs?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedTasks?: Partial<Task>[];
}
