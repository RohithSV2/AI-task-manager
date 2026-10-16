'use client';

import React from 'react';
import { 
  CheckSquare, 
  Layers, 
  ListTodo, 
  Grid3X3, 
  BarChart3, 
  Bot, 
  RotateCcw,
  Plus,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: 'kanban' | 'list' | 'eisenhower' | 'analytics';
  setCurrentView: (view: 'kanban' | 'list' | 'eisenhower' | 'analytics') => void;
  onOpenNewTaskModal: () => void;
  onOpenAICopilot: () => void;
  onResetTasks: () => void;
  taskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenNewTaskModal,
  onOpenAICopilot,
  onResetTasks,
  taskCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF9F6]/90 border-b border-[#ECE8DD] text-stone-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-stone-900 flex items-center justify-center shadow-warm-sm">
              <CheckSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-stone-900">
                  TaskMaster
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Intelligent & Focused Productivity
              </p>
            </div>
          </div>

          {/* Segmented View Switcher */}
          <nav className="hidden md:flex items-center bg-[#F1EDE4] p-1 rounded-xl border border-[#ECE8DD]">
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'kanban'
                  ? 'bg-white text-stone-900 shadow-warm-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'list'
                  ? 'bg-white text-stone-900 shadow-warm-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setCurrentView('eisenhower')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'eisenhower'
                  ? 'bg-white text-stone-900 shadow-warm-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-white text-stone-900 shadow-warm-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white border border-[#E5E0D4] hover:bg-[#F6F4EE] hover:text-stone-900 transition-all shadow-warm-sm"
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-warm-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              onClick={onResetTasks}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-[#F1EDE4] rounded-lg transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-[#ECE8DD] scrollbar-none">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'kanban' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setCurrentView('list')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'list' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setCurrentView('eisenhower')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'eisenhower' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Matrix
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'analytics' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
