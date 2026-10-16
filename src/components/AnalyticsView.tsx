'use client';

import React from 'react';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Task } from '@/types';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

  // Group by category
  const categories: Record<string, number> = {
    Work: 0,
    Personal: 0,
    Development: 0,
    Design: 0,
    Study: 0,
    Health: 0
  };
  tasks.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });

  // Group by priority
  const priorities: Record<string, number> = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Productivity & Goal Completion Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time workload tracking, time estimates, and completion velocity.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Productivity Streak: Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Completion Rate</span>
          <div className="text-2xl font-black text-white mt-1">{completionRate}%</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Total Planned Hours</span>
          <div className="text-2xl font-black text-purple-400 mt-1">{totalEstimatedHours}h</div>
          <p className="text-[11px] text-slate-400 mt-1">{totalActualHours}h completed so far</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">Active In Progress</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{inProgress} Tasks</div>
          <p className="text-[11px] text-slate-400 mt-1">Currently in focus</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-slate-400">AI Planned Tasks</span>
          <div className="text-2xl font-black text-fuchsia-400 mt-1">
            {tasks.filter(t => t.aiSuggested).length}
          </div>
          <p className="text-[11px] text-fuchsia-300 mt-1">Enhanced with AI subtasks</p>
        </div>
      </div>

      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Tasks by Priority Level
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Urgent', count: priorities.urgent, color: 'bg-rose-500', text: 'text-rose-400' },
              { label: 'High', count: priorities.high, color: 'bg-amber-500', text: 'text-amber-400' },
              { label: 'Medium', count: priorities.medium, color: 'bg-blue-500', text: 'text-blue-400' },
              { label: 'Low', count: priorities.low, color: 'bg-slate-500', text: 'text-slate-400' }
            ].map(p => {
              const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
              return (
                <div key={p.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-semibold ${p.text}`}>{p.label}</span>
                    <span className="text-slate-400">{p.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${p.color} rounded-full transition-all duration-300`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Life & Work Domain Breakdown
          </h4>

          <div className="space-y-3">
            {Object.entries(categories).map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-slate-400">{count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Productivity Tips */}
      <div className="bg-slate-900/90 border border-purple-800/40 rounded-2xl p-5 shadow-2xl">
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI Productivity Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
              <Zap className="w-4 h-4" /> Focus on High-Leverage Tasks
            </div>
            <p className="text-slate-400 text-[11px]">
              Tackle your Q1 urgent items in the morning when mental energy is highest, reserving afternoons for Q2 deep work.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
              <Clock className="w-4 h-4" /> Smart Timeboxing
            </div>
            <p className="text-slate-400 text-[11px]">
              Break down larger tasks taking over 3 hours into bite-sized 45-minute focus intervals using AI Auto-Breakdown.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Celebrate Small Wins
            </div>
            <p className="text-slate-400 text-[11px]">
              Checking off individual subtasks maintains steady dopamine release and prevents task procrastination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
