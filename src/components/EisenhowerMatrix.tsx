'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Calendar, 
  Users, 
  Archive, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Folder
} from 'lucide-react';
import { Task, EisenhowerQuadrant } from '@/types';
import confetti from 'canvas-confetti';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onOpenTaskModal: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  tasks,
  onUpdateTasks,
  onOpenTaskModal,
  onToggleSubtask
}) => {
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRunAIPrioritize = async () => {
    setIsPrioritizing(true);
    setMessage(null);

    try {
      const res = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        onUpdateTasks(data.tasks);
        setMessage(`AI prioritized ${data.totalAnalyzed} tasks across the Eisenhower Matrix.`);

        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to run AI prioritization.');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const quadrants: {
    key: EisenhowerQuadrant;
    title: string;
    subtitle: string;
    icon: any;
    borderColor: string;
    bgGradient: string;
    badgeColor: string;
  }[] = [
    {
      key: 'q1_urgent_important',
      title: 'Q1: DO FIRST',
      subtitle: 'Critical Deadlines, Emergencies & Urgent Commitments',
      icon: Flame,
      borderColor: 'border-rose-500/40',
      bgGradient: 'from-rose-950/20 via-slate-900 to-slate-950',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    {
      key: 'q2_not_urgent_important',
      title: 'Q2: SCHEDULE / FOCUS',
      subtitle: 'Strategic Goals, Deep Work, Skill Building & Health',
      icon: Calendar,
      borderColor: 'border-purple-500/40',
      bgGradient: 'from-purple-950/20 via-slate-900 to-slate-950',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    },
    {
      key: 'q3_urgent_not_important',
      title: 'Q3: DELEGATE / QUICK WINS',
      subtitle: 'Interruptive Requests, Routine Admin, Minor Errands',
      icon: Users,
      borderColor: 'border-amber-500/40',
      bgGradient: 'from-amber-950/20 via-slate-900 to-slate-950',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      key: 'q4_not_urgent_not_important',
      title: 'Q4: ELIMINATE / BACKLOG',
      subtitle: 'Low-Value Distractions & Non-Essential Ideas',
      icon: Archive,
      borderColor: 'border-slate-700/60',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
      badgeColor: 'bg-slate-700/40 text-slate-400 border-slate-600/40'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              Eisenhower Matrix (Urgency vs. Importance)
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              AI Decision Matrix
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Automatically organize your personal and professional tasks into four distinct focus quadrants to maximize productive impact.
          </p>
        </div>

        <button
          onClick={handleRunAIPrioritize}
          disabled={isPrioritizing || tasks.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 transition-all shrink-0 disabled:opacity-50"
        >
          {isPrioritizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Task Urgency...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Auto-Prioritize with AI</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map(q => {
          const qTasks = tasks.filter(t => t.eisenhowerQuadrant === q.key);
          const Icon = q.icon;

          return (
            <div
              key={q.key}
              className={`border ${q.borderColor} bg-gradient-to-br ${q.bgGradient} rounded-2xl p-4 shadow-lg min-h-[380px] flex flex-col`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${q.badgeColor} border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {q.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {q.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${q.badgeColor}`}>
                  {qTasks.length} tasks
                </span>
              </div>

              {/* Tasks in Quadrant */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {qTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800/60 rounded-xl my-auto">
                    No tasks currently in this quadrant.
                  </div>
                ) : (
                  qTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskModal(task)}
                      className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-750 rounded-xl cursor-pointer transition-all shadow-sm group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-semibold text-slate-300 uppercase px-1.5 py-0.5 rounded bg-slate-800">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.estimatedHours}h est.
                        </span>
                      </div>

                      <h5 className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-1">
                        {task.title}
                      </h5>

                      {task.project && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                          <Folder className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{task.project}</span>
                        </div>
                      )}

                      {task.aiInsight && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1">
                          💡 {task.aiInsight}
                        </p>
                      )}
                    </div>
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
