'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Wand2, Zap } from 'lucide-react';
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
    'Redesign mobile checkout user interface and wireframe new cart flow',
    'Complete final semester research project and slides before Monday',
    'Schedule routine health checkup and plan weekly fitness regimen'
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
        project: p.project || `${p.category || 'General'} Projects`,
        eisenhowerQuadrant: p.eisenhowerQuadrant || 'q2_not_urgent_important',
        aiSuggested: true,
        aiComplexityScore: p.aiComplexityScore || 65,
        aiInsight: p.aiInsight || 'Auto-generated using AI Task Parser',
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
          particleCount: 50,
          spread: 60,
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
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Quick AI Task Generator (Natural Language & Voice Parser)
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Type naturally in plain English
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
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20 transition-all shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Parsing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create with AI</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="text-xs text-rose-400 mt-1">
            ⚠️ {error}
          </p>
        )}

        {/* Preset chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs scrollbar-none">
          <span className="text-slate-400 font-medium whitespace-nowrap">Examples:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCreateWithAI(p)}
              disabled={loading}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-[11px]"
            >
              {p.slice(0, 48)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
