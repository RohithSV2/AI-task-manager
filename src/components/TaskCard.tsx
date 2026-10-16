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
    urgent: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    low: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' }
  };

  const categoryColors: Record<TaskCategory, string> = {
    Work: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Personal: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Development: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Design: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    Study: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Health: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
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
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 shadow-lg hover:shadow-purple-500/5 transition-all duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[task.category] || 'bg-slate-800 text-slate-300'}`}>
            {task.category}
          </span>
        </div>

        {task.aiSuggested && (
          <span className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            AI Optimized
          </span>
        )}
      </div>

      {/* Title */}
      <h4 
        onClick={() => onOpenDetails(task)}
        className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors cursor-pointer line-clamp-2 mb-1.5"
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Project Pill */}
      {task.project && (
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/70 px-2 py-1 rounded-md border border-slate-800/80 mb-3 w-fit">
          <Folder className="w-3 h-3 text-purple-400" />
          <span className="truncate max-w-[200px]">{task.project}</span>
        </div>
      )}

      {/* Subtasks checklist preview */}
      {totalSubtasks > 0 && (
        <div className="mb-3 space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Action Items</span>
            <span className="font-medium text-slate-300">{completedSubtasks}/{totalSubtasks} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
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
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
              >
                {sub.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className={`truncate ${sub.completed ? 'line-through text-slate-500' : ''}`}>
                  {sub.title}
                </span>
              </div>
            ))}
            {totalSubtasks > 2 && (
              <p 
                onClick={() => onOpenDetails(task)}
                className="text-[10px] text-purple-400 hover:underline cursor-pointer pt-0.5"
              >
                +{totalSubtasks - 2} more subtasks...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className={overdue ? 'text-rose-400 font-medium flex items-center gap-1' : ''}>
            {overdue && <AlertTriangle className="w-3 h-3 inline" />}
            {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{task.estimatedHours}h est.</span>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/50">
        <button
          onClick={() => onOpenDetails(task)}
          className="text-xs text-slate-400 hover:text-white font-medium hover:underline"
        >
          Details
        </button>

        <div className="flex items-center gap-1">
          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(task.id, nextStatus)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30 transition-all"
              title={`Advance to ${nextStatus.replace('_', ' ')}`}
            >
              <span>Move Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {task.status === 'completed' && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
