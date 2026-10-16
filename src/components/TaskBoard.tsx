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
  { status: 'backlog', title: 'Backlog', dotColor: 'bg-stone-400', badgeBg: 'bg-white text-stone-600 border border-[#ECE8DD]' },
  { status: 'todo', title: 'To Do', dotColor: 'bg-blue-500', badgeBg: 'bg-blue-50 text-blue-800 border border-blue-200' },
  { status: 'in_progress', title: 'In Progress', dotColor: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-800 border border-amber-200' },
  { status: 'review', title: 'Review', dotColor: 'bg-purple-500', badgeBg: 'bg-purple-50 text-purple-800 border border-purple-200' },
  { status: 'completed', title: 'Completed', dotColor: 'bg-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200' }
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
      const matchesSearch = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.project && task.project.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
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
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-3.5 flex flex-col md:flex-row gap-3 items-center justify-between shadow-warm-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, projects..."
            className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-2.5 py-1 shrink-0">
            <Filter className="w-3 h-3 text-stone-400" />
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-warm-sm shrink-0 transition-all ml-auto md:ml-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Board Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-[#E8E4DA] p-3 rounded-xl flex items-center justify-between shadow-warm-sm">
          <span className="text-stone-500 font-medium">Total Tasks</span>
          <span className="font-bold text-stone-900 text-sm">{stats.total}</span>
        </div>
        <div className="bg-white border border-[#E8E4DA] p-3 rounded-xl flex items-center justify-between shadow-warm-sm">
          <span className="text-stone-500 font-medium">Completed</span>
          <span className="font-bold text-emerald-700 text-sm">{stats.completed}</span>
        </div>
        <div className="bg-white border border-[#E8E4DA] p-3 rounded-xl flex items-center justify-between shadow-warm-sm">
          <span className="text-stone-500 font-medium">High / Urgent</span>
          <span className="font-bold text-rose-700 text-sm">{stats.urgentCount}</span>
        </div>
        <div className="bg-white border border-[#E8E4DA] p-3 rounded-xl flex items-center justify-between shadow-warm-sm">
          <span className="text-stone-500 font-medium">Total Planned</span>
          <span className="font-bold text-stone-900 text-sm">{stats.totalEstHours} hrs</span>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map(col => {
          const columnTasks = filteredTasks.filter(t => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-[#F6F4EE]/70 border border-[#ECE8DD] rounded-2xl p-3 flex flex-col gap-2.5 min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DA]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <h4 className="text-xs font-bold text-stone-800 tracking-wide">
                    {col.title}
                  </h4>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Task Cards */}
              <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-stone-400 border border-dashed border-[#DDD7C8] rounded-xl my-auto">
                    <Inbox className="w-5 h-5 mb-1 opacity-40 text-stone-400" />
                    <p className="text-[11px]">No tasks</p>
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
