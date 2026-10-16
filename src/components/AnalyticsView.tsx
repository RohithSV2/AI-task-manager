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
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-warm-sm">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Productivity & Goal Analytics
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time tracking of goal velocity, focus intervals, and domain distribution.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Productivity Streak Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-warm-sm">
          <span className="text-xs text-stone-500">Completion Rate</span>
          <div className="text-2xl font-black text-stone-900 mt-1">{completionRate}%</div>
          <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#ECE8DD] rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-warm-sm">
          <span className="text-xs text-stone-500">Planned Hours</span>
          <div className="text-2xl font-black text-stone-900 mt-1">{totalEstimatedHours}h</div>
          <p className="text-[11px] text-stone-400 mt-1">{totalActualHours}h logged so far</p>
        </div>

        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-warm-sm">
          <span className="text-xs text-stone-500">Currently in Focus</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{inProgress} Tasks</div>
          <p className="text-[11px] text-stone-400 mt-1">Active in progress</p>
        </div>

        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 shadow-warm-sm">
          <span className="text-xs text-stone-500">AI Planned Tasks</span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {tasks.filter(t => t.aiSuggested).length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Decomposed with AI</p>
        </div>
      </div>

      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Distribution */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 shadow-warm-sm">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-stone-600" />
            Tasks by Priority Level
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Urgent', count: priorities.urgent, color: 'bg-rose-500', text: 'text-rose-700' },
              { label: 'High', count: priorities.high, color: 'bg-amber-500', text: 'text-amber-800' },
              { label: 'Medium', count: priorities.medium, color: 'bg-stone-500', text: 'text-stone-700' },
              { label: 'Low', count: priorities.low, color: 'bg-stone-300', text: 'text-stone-500' }
            ].map(p => {
              const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
              return (
                <div key={p.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-semibold ${p.text}`}>{p.label}</span>
                    <span className="text-stone-400">{p.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F6F4EE] rounded-full overflow-hidden">
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
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 shadow-warm-sm">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-stone-600" />
            Life & Work Domain Breakdown
          </h4>

          <div className="space-y-3">
            {Object.entries(categories).map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700 font-medium">{cat}</span>
                    <span className="text-stone-400">{count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F6F4EE] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-stone-700 rounded-full transition-all duration-300"
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
      <div className="bg-[#FAF8F3] border border-[#E8E4DA] rounded-2xl p-5 shadow-warm-sm">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Productivity Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white border border-[#E8E4DA] rounded-xl shadow-warm-sm">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> High-Leverage Mornings
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Complete your top Q1 urgent tasks in morning focus blocks before opening distracting inboxes or messaging apps.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#E8E4DA] rounded-xl shadow-warm-sm">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5 text-stone-700" /> 45-Minute Focus Sprints
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Break down larger tasks taking over 2 hours into discrete steps with AI Auto-Breakdown to avoid mental exhaustion.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#E8E4DA] rounded-xl shadow-warm-sm">
            <div className="flex items-center gap-1.5 text-stone-900 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Steady Execution Momentum
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Ticking off action items generates psychological momentum that makes subsequent complex tasks feel lighter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
