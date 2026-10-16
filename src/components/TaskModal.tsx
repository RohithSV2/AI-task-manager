'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Folder, 
  CheckCircle2, 
  Circle,
  Loader2,
  Save
} from 'lucide-react';
import { Task, Priority, TaskCategory, TaskStatus } from '@/types';
import { generateId } from '@/lib/utils';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        id: generateId(),
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimatedHours: 3,
        actualHours: 0,
        subtasks: [],
        tags: ['General'],
        project: 'Personal Projects',
        eisenhowerQuadrant: 'q2_not_urgent_important',
        aiSuggested: false,
        aiComplexityScore: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const currentSubtasks = formData.subtasks || [];
    setFormData(prev => ({
      ...prev,
      subtasks: [
        ...currentSubtasks,
        {
          id: generateId(),
          title: newSubtaskTitle.trim(),
          completed: false,
          estimatedMinutes: 45
        }
      ]
    }));
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    const currentSubtasks = formData.subtasks || [];
    setFormData(prev => ({
      ...prev,
      subtasks: currentSubtasks.map(s => 
        s.id === subId ? { ...s, completed: !s.completed } : s
      )
    }));
  };

  const handleDeleteSubtask = (subId: string) => {
    const currentSubtasks = formData.subtasks || [];
    setFormData(prev => ({
      ...prev,
      subtasks: currentSubtasks.filter(s => s.id !== subId)
    }));
  };

  const handleAIBreakdown = async () => {
    if (!formData.title) return;
    setIsBreakingDown(true);

    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.subtasks)) {
        const existing = formData.subtasks || [];
        setFormData(prev => ({
          ...prev,
          subtasks: [...existing, ...data.subtasks],
          aiSuggested: true,
          aiInsight: data.aiSummary || prev.aiInsight
        }));
      }
    } catch (e) {
      console.error('Failed to trigger AI breakdown', e);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    onSave(formData as Task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-[#E8E4DA] rounded-2xl shadow-warm-lg overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1EDE4] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">
              {task ? 'Edit Task Details' : 'Create New Task'}
            </h3>
            {formData.aiSuggested && (
              <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="w-2.5 h-2.5" /> AI Assisted
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#F1EDE4] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Design presentation slides for product launch"
              className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description & Notes
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Add key goals, reference links, and acceptance criteria..."
              className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-500 transition-all resize-none"
            />
          </div>

          {/* Grid Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <select
                value={formData.category || 'Work'}
                onChange={(e) => handleFieldChange('category', e.target.value as TaskCategory)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => handleFieldChange('priority', e.target.value as Priority)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Status
              </label>
              <select
                value={formData.status || 'todo'}
                onChange={(e) => handleFieldChange('status', e.target.value as TaskStatus)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Project / Tag
              </label>
              <input
                type="text"
                value={formData.project || ''}
                onChange={(e) => handleFieldChange('project', e.target.value)}
                placeholder="e.g. Q4 Growth, Fitness"
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estimated Duration (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours || 1}
                onChange={(e) => handleFieldChange('estimatedHours', parseFloat(e.target.value))}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Subtasks Section with AI Breakdown */}
          <div className="pt-2 border-t border-[#F1EDE4]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Action Steps ({formData.subtasks?.length || 0})
              </label>
              <button
                type="button"
                onClick={handleAIBreakdown}
                disabled={isBreakingDown || !formData.title}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F6F4EE] hover:bg-[#ECE8DD] text-stone-800 border border-[#EAE5DA] transition-all disabled:opacity-40"
              >
                {isBreakingDown ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                    <span>AI Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>AI Breakdown</span>
                  </>
                )}
              </button>
            </div>

            {/* List */}
            <div className="space-y-1.5 mb-2.5">
              {(formData.subtasks || []).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#EAE5DA]"
                >
                  <div
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-2 cursor-pointer text-xs flex-1 text-stone-800"
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500 shrink-0" />
                    )}
                    <span className={`text-xs ${sub.completed ? 'line-through text-stone-400' : ''}`}>
                      {sub.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="text-stone-300 hover:text-rose-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add next action item..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-[#FAF9F6] border border-[#E5E0D4] rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-[#F6F4EE] hover:bg-[#ECE8DD] text-stone-700 text-xs font-medium border border-[#EAE5DA] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* AI Insights display */}
          {formData.aiInsight && (
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{formData.aiInsight}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F1EDE4]">
            {task ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-[#F1EDE4] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-warm-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
