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
    bgColor: string;
    badgeColor: string;
  }[] = [
    {
      key: 'q1_urgent_important',
      title: 'Q1: DO FIRST',
      subtitle: 'Critical Deadlines & Immediate Commitments',
      icon: Flame,
      borderColor: 'border-[#F8D2D5]',
      bgColor: 'bg-[#FFF7F7]',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      key: 'q2_not_urgent_important',
      title: 'Q2: SCHEDULE / FOCUS',
      subtitle: 'Strategic Goals, Deep Work & Skill Building',
      icon: Calendar,
      borderColor: 'border-[#F4E3C8]',
      bgColor: 'bg-[#FFFAF2]',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      key: 'q3_urgent_not_important',
      title: 'Q3: DELEGATE / QUICK WINS',
      subtitle: 'Minor Inquiries & Quick Administrative Tasks',
      icon: Users,
      borderColor: 'border-[#D9E6F4]',
      bgColor: 'bg-[#F6F9FD]',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    {
      key: 'q4_not_urgent_not_important',
      title: 'Q4: ELIMINATE / BACKLOG',
      subtitle: 'Low-Priority Distractions & Non-Essentials',
      icon: Archive,
      borderColor: 'border-[#E6E1D5]',
      bgColor: 'bg-[#F9F8F5]',
      badgeColor: 'bg-stone-100 text-stone-600 border-stone-200'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-warm-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Eisenhower Decision Matrix
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              Urgency vs. Importance
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 max-w-xl">
            Automatically organize your daily priorities into four quadrants to stay focused on high-leverage outcomes.
          </p>
        </div>

        <button
          onClick={handleRunAIPrioritize}
          disabled={isPrioritizing || tasks.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs text-white bg-stone-900 hover:bg-stone-800 shadow-warm-sm transition-all shrink-0 disabled:opacity-40"
        >
          {isPrioritizing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Analyzing Task Urgency...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Prioritize with AI</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
              className={`border ${q.borderColor} ${q.bgColor} rounded-2xl p-4 shadow-warm-sm min-h-[360px] flex flex-col`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE8DD] mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${q.badgeColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      {q.title}
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      {q.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${q.badgeColor}`}>
                  {qTasks.length} tasks
                </span>
              </div>

              {/* Tasks in Quadrant */}
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {qTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-6 text-center text-stone-400 text-xs border border-dashed border-[#E2DDD0] rounded-xl my-auto">
                    No tasks currently in this quadrant.
                  </div>
                ) : (
                  qTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskModal(task)}
                      className="p-3 bg-white hover:bg-[#FFFEFC] border border-[#E8E4DA] hover:border-stone-400 rounded-xl cursor-pointer transition-all shadow-warm-sm group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-medium text-stone-600 uppercase px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#ECE8DD]">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {task.estimatedHours}h est.
                        </span>
                      </div>

                      <h5 className="text-xs font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 mb-1">
                        {task.title}
                      </h5>

                      {task.project && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-1">
                          <Folder className="w-2.5 h-2.5" />
                          <span className="truncate">{task.project}</span>
                        </div>
                      )}

                      {task.aiInsight && (
                        <p className="text-[10px] text-stone-500 line-clamp-1">
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
