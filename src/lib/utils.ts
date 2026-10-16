import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return 'task_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'No due date';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function isOverdue(dateString?: string): boolean {
  if (!dateString) return false;
  try {
    const d = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d < now;
  } catch {
    return false;
  }
}
