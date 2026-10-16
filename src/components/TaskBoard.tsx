'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Inbox
} from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onOpenTaskModal: (task: Task | null) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

interface ColumnConfig {
  status: TaskStatus;
  title: string;
  dotColor: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  { status: 'backlog', title: 'Backlog', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-500/10 text-slate-300' },
  { status: 'todo', title: 'To Do', dotColor: 'bg-blue-400', badgeBg: 'bg-blue-500/10 text-blue-300' },
  { status: 'in_progress', title: 'In Progress', dotColor: 'bg-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300' },
  { status: 'review', title: 'Review', dotColor: 'bg-purple-400', badgeBg: 'bg-purple-500/10 text-purple-300' },
  { status: 'completed', title: 'Completed', dotColor: 'bg-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-300' }
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onOpenTaskModal,
  onUpdateTaskStatus,
  onDeleteTask,
  onToggleSubtask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.project && task.project.toLowerCase().includes(searchQuery.toLowerCase()));

      // Priority filter
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

      // Category filter
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, selectedPriority, selectedCategory]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const urgentCount = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed').length;
    const totalEstHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    return { total, completed, urgentCount, totalEstHours };
  }, [tasks]);

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, projects..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 shrink-0 transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Board Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <span className="text-slate-400">Total Tasks</span>
          <span className="font-bold text-white text-sm">{stats.total}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <span className="text-slate-400">Completed</span>
          <span className="font-bold text-emerald-400 text-sm">{stats.completed}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <span className="text-slate-400">High / Urgent</span>
          <span className="font-bold text-rose-400 text-sm">{stats.urgentCount}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <span className="text-slate-400">Total Est. Hours</span>
          <span className="font-bold text-purple-400 text-sm">{stats.totalEstHours} hrs</span>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map(col => {
          const columnTasks = filteredTasks.filter(t => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h4 className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                    {col.title}
                  </h4>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Task Cards */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-600 border border-dashed border-slate-800/60 rounded-xl my-auto">
                    <Inbox className="w-6 h-6 mb-1 opacity-50" />
                    <p className="text-xs">No tasks</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpenDetails={onOpenTaskModal}
                      onUpdateStatus={onUpdateTaskStatus}
                      onDeleteTask={onDeleteTask}
                      onToggleSubtask={onToggleSubtask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
