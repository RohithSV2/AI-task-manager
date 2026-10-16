'use client';

import React from 'react';
import { 
  Cloud, 
  Sparkles, 
  Layers, 
  Grid3X3, 
  Activity, 
  Bot, 
  RotateCcw,
  Plus,
  Server
} from 'lucide-react';

interface NavbarProps {
  currentView: 'kanban' | 'eisenhower' | 'telemetry' | 'analytics';
  setCurrentView: (view: 'kanban' | 'eisenhower' | 'telemetry' | 'analytics') => void;
  onOpenNewTaskModal: () => void;
  onOpenAICopilot: () => void;
  onOpenArchitecture: () => void;
  onResetTasks: () => void;
  taskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenNewTaskModal,
  onOpenAICopilot,
  onOpenArchitecture,
  onResetTasks,
  taskCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  CloudTask AI
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Cloud v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Cloud-Native Task Orchestration
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'kanban'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Eisenhower Matrix
            </button>
            <button
              onClick={() => setCurrentView('telemetry')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'telemetry'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Cloud Telemetry
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Analytics
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/50 transition-all"
              title="View Cloud Computing Architecture Diagram"
            >
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cloud Arch</span>
            </button>

            <button
              onClick={onOpenAICopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-500/20 transition-all"
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

        {/* Mobile View Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 scrollbar-none">
          <button
            onClick={() => setCurrentView('kanban')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setCurrentView('eisenhower')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'eisenhower' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Eisenhower
          </button>
          <button
            onClick={() => setCurrentView('telemetry')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'telemetry' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Cloud Telemetry
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentView === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
