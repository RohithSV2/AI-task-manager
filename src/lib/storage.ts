'use client';

import { Task } from '@/types';
import { initialTasks } from './default-tasks';

const STORAGE_KEY = 'ai_task_manager_cloud_tasks_v1';

export function loadTasksFromStorage(): Task[] {
  if (typeof window === 'undefined') return initialTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
      return initialTasks;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTasks;
  } catch (e) {
    console.error('Failed to load tasks from local storage', e);
    return initialTasks;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to local storage', e);
  }
}

export function resetTasksToDefault(): Task[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
  }
  return initialTasks;
}
