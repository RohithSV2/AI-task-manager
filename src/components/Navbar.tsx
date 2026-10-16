'use client';

import React from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Layers, 
  Grid3X3, 
  BarChart3, 
  Bot, 
  RotateCcw,
  Plus
} from 'lucide-react';

interface NavbarProps {
  currentView: 'kanban' | 'eisenhower' | 'analytics';
  setCurrentView: (view: 'kanban' | 'eisenhower' | 'analytics') => void;
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  TaskMaster AI
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Smart Task Planning, Breakdown & Workload Prioritization
              </p>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'kanban'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Kanban Board
            </button>
            <button
              onClick={() => setCurrentView('eisenhower')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'eisenhower'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Eisenhower Matrix
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Productivity Analytics
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-purple-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              onClick={onResetTasks}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 scrollbar-none">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setCurrentView('eisenhower')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'eisenhower' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Eisenhower Matrix
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
