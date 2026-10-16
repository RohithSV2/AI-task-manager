'use client';

import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  AlertTriangle,
  Sparkles,
  Trash2,
  ChevronRight,
  Folder
} from 'lucide-react';
import { Task, TaskStatus, Priority, TaskCategory } from '@/types';
import { formatDate, isOverdue } from '@/lib/utils';

interface TaskListViewProps {
  tasks: Task[];
  onOpenTaskModal: (task: Task | null) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onOpenTaskModal,
  onUpdateTaskStatus,
  onDeleteTask,
  onToggleSubtask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.project && task.project.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriority, selectedCategory, selectedStatus]);

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

  const statusLabels: Record<TaskStatus, { label: string; badge: string }> = {
    backlog: { label: 'Backlog', badge: 'bg-stone-100 text-stone-600 border-stone-200' },
    todo: { label: 'To Do', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    in_progress: { label: 'In Progress', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
    review: { label: 'Review', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    completed: { label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-warm-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or projects..."
            className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-2.5 py-1 shrink-0">
            <Filter className="w-3 h-3 text-stone-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-2.5 py-1 shrink-0">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-2.5 py-1 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <button
            onClick={() => onOpenTaskModal(null)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-warm-sm shrink-0 transition-all ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* High-Efficiency List Table */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-warm-sm overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            No tasks match the active filters.
          </div>
        ) : (
          <div className="divide-y divide-[#F1EDE4]">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'completed';
              const overdue = isOverdue(task.dueDate) && !isDone;
              const completedSubs = task.subtasks.filter(s => s.completed).length;

              return (
                <div
                  key={task.id}
                  className="p-3 sm:px-4 sm:py-3 hover:bg-[#FAF9F6] transition-colors flex items-center justify-between gap-3 group"
                >
                  {/* Left: Checkbox + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onUpdateTaskStatus(task.id, isDone ? 'todo' : 'completed')}
                      className="text-stone-400 hover:text-stone-700 shrink-0 transition-colors"
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>

                    <div 
                      onClick={() => onOpenTaskModal(task)}
                      className="cursor-pointer min-w-0 flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium text-stone-900 truncate ${isDone ? 'line-through text-stone-400' : ''}`}>
                          {task.title}
                        </span>
                        {task.aiSuggested && (
                          <span className="shrink-0 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
                            AI
                          </span>
                        )}
                      </div>

                      {task.project && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                          <Folder className="w-2.5 h-2.5" />
                          <span>{task.project}</span>
                          {task.subtasks.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{completedSubs}/{task.subtasks.length} steps</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Category */}
                    <span className={`hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[task.category]}`}>
                      {task.category}
                    </span>

                    {/* Priority */}
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border}`}>
                      {task.priority}
                    </span>

                    {/* Due Date */}
                    <span className={`text-[11px] text-stone-500 hidden md:flex items-center gap-1 min-w-[70px] ${overdue ? 'text-rose-600 font-medium' : ''}`}>
                      {overdue && <AlertTriangle className="w-3 h-3 text-rose-500 inline" />}
                      {formatDate(task.dueDate)}
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-[10px] font-medium px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusLabels[task.status].badge}`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Done</option>
                    </select>

                    {/* Quick Delete */}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
