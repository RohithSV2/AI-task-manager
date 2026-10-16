'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Wand2 } from 'lucide-react';
import { Task } from '@/types';
import { generateId } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface QuickAITaskBarProps {
  onTaskCreated: (task: Task) => void;
}

export const QuickAITaskBar: React.FC<QuickAITaskBarProps> = ({ onTaskCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    'Prepare pitch deck for investor meeting by Friday 3pm with high priority',
    'Redesign mobile checkout flow and user interface wireframes',
    'Complete final semester research project and summary before Monday',
    'Schedule routine dental checkup and plan weekly fitness workout'
  ];

  const handleCreateWithAI = async (textToParse?: string) => {
    const input = (textToParse || prompt).trim();
    if (!input) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      if (!res.ok || !data.data) {
        throw new Error(data.error || 'Failed to parse AI task');
      }

      const p = data.data;
      const newTask: Task = {
        id: generateId(),
        title: p.title,
        description: p.description || '',
        priority: p.priority || 'medium',
        status: 'todo',
        category: p.category || 'Work',
        dueDate: p.dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimatedHours: p.estimatedHours || 3,
        actualHours: 0,
        tags: p.tags && p.tags.length > 0 ? p.tags : [p.category || 'Work'],
        project: p.project || `${p.category || 'General'} Project`,
        eisenhowerQuadrant: p.eisenhowerQuadrant || 'q2_not_urgent_important',
        aiSuggested: true,
        aiComplexityScore: p.aiComplexityScore || 65,
        aiInsight: p.aiInsight || 'Auto-generated using AI Natural Language Parser',
        subtasks: Array.isArray(p.subtasks)
          ? p.subtasks.map((s: any) => ({
              id: generateId(),
              title: s.title,
              completed: false,
              estimatedMinutes: s.estimatedMinutes || 45
            }))
          : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onTaskCreated(newTask);
      setPrompt('');

      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error parsing task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E8E4DA] rounded-2xl p-4 sm:p-5 shadow-warm-sm transition-all">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-stone-900 tracking-tight">
              Natural Language Task Input
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Type anything in plain English, AI formats the task & subtasks
          </span>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWithAI();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Prepare quarterly presentation by Thursday 4pm with high priority and 3 subtasks..."
              className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-500 transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-warm-sm transition-all shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>AI Parsing...</span>
              </>
            ) : (
              <>
                <span>Add with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-xs text-rose-600 mt-0.5">
            ⚠️ {error}
          </p>
        )}

        {/* Preset chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-0.5 scrollbar-none">
          <span className="text-stone-400 text-[11px] font-medium whitespace-nowrap">Suggestions:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCreateWithAI(p)}
              disabled={loading}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#F6F4EE] hover:bg-[#EDE9DE] border border-[#EAE5DA] text-stone-600 hover:text-stone-900 transition-all text-[11px]"
            >
              {p.slice(0, 48)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
