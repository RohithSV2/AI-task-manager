'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Folder, 
  Calendar, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { Task, Priority, TaskStatus, TaskCategory } from '@/types';
import { formatDate, isOverdue } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onOpenDetails: (task: Task) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onOpenDetails,
  onUpdateStatus,
  onDeleteTask,
  onToggleSubtask
}) => {
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
    urgent: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    high: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    medium: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
    low: { bg: 'bg-stone-50', text: 'text-stone-500', border: 'border-stone-200' }
  };

  const categoryColors: Record<TaskCategory, string> = {
    Work: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    Personal: 'bg-amber-50 text-amber-800 border-amber-200/60',
    Development: 'bg-sky-50 text-sky-700 border-sky-200/60',
    Design: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/60',
    Study: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    Health: 'bg-rose-50 text-rose-700 border-rose-200/60'
  };

  const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
    backlog: 'todo',
    todo: 'in_progress',
    in_progress: 'review',
    review: 'completed',
    completed: null
  };

  const nextStatus = nextStatusMap[task.status];

  return (
    <div className="group relative bg-white hover:bg-[#FFFEFC] border border-[#E8E4DA] hover:border-stone-400/80 rounded-xl p-4 shadow-warm-sm hover:shadow-warm-md transition-all duration-150">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[task.category] || 'bg-stone-100 text-stone-700'}`}>
            {task.category}
          </span>
        </div>

        {task.aiSuggested && (
          <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            AI Plan
          </span>
        )}
      </div>

      {/* Title */}
      <h4 
        onClick={() => onOpenDetails(task)}
        className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors cursor-pointer line-clamp-2 mb-1.5"
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-stone-500 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Project Pill */}
      {task.project && (
        <div className="flex items-center gap-1 text-[10px] text-stone-600 bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#EAE5DA] mb-3 w-fit">
          <Folder className="w-2.5 h-2.5 text-stone-400" />
          <span className="truncate max-w-[190px]">{task.project}</span>
        </div>
      )}

      {/* Subtasks checklist preview */}
      {totalSubtasks > 0 && (
        <div className="mb-3 space-y-1.5 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EAE5DA]">
          <div className="flex items-center justify-between text-[10px] text-stone-500">
            <span>Action Items</span>
            <span className="font-semibold text-stone-700">{completedSubtasks}/{totalSubtasks} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-1 bg-[#E8E4DA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-stone-800 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="pt-1 space-y-1">
            {task.subtasks.slice(0, 2).map((sub) => (
              <div 
                key={sub.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSubtask(task.id, sub.id);
                }}
                className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-stone-950"
              >
                {sub.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-stone-300 hover:text-stone-400 shrink-0" />
                )}
                <span className={`truncate text-[11px] ${sub.completed ? 'line-through text-stone-400' : ''}`}>
                  {sub.title}
                </span>
              </div>
            ))}
            {totalSubtasks > 2 && (
              <p 
                onClick={() => onOpenDetails(task)}
                className="text-[10px] text-stone-500 hover:text-stone-800 cursor-pointer pt-0.5"
              >
                +{totalSubtasks - 2} more items...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-[#F1EDE4]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-stone-400" />
          <span className={overdue ? 'text-rose-600 font-medium flex items-center gap-1' : ''}>
            {overdue && <AlertTriangle className="w-3 h-3 inline" />}
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{task.estimatedHours}h</span>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-[#F1EDE4]">
        <button
          onClick={() => onOpenDetails(task)}
          className="text-[11px] text-stone-500 hover:text-stone-900 font-medium"
        >
          Details
        </button>

        <div className="flex items-center gap-1">
          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(task.id, nextStatus)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4F1EA] hover:bg-[#EAE5DA] text-stone-800 text-[11px] font-medium border border-[#E2DDD0] transition-all"
              title={`Move to ${nextStatus.replace('_', ' ')}`}
            >
              <span>Move</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}

          {task.status === 'completed' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5" /> Done
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
