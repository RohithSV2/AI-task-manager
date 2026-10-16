export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';

export type TaskCategory = 'Work' | 'Personal' | 'Development' | 'Design' | 'Study' | 'Health';

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
  dueDate: string; // YYYY-MM-DD
  estimatedHours: number;
  actualHours?: number;
  subtasks: Subtask[];
  tags: string[];
  eisenhowerQuadrant: EisenhowerQuadrant;
  aiSuggested?: boolean;
  aiComplexityScore?: number; // 1-100
  aiInsight?: string;
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
