'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { QuickAITaskBar } from '@/components/QuickAITaskBar';
import { TaskBoard } from '@/components/TaskBoard';
import { EisenhowerMatrix } from '@/components/EisenhowerMatrix';
import { CloudTelemetryDashboard } from '@/components/CloudTelemetryDashboard';
import { AnalyticsView } from '@/components/AnalyticsView';
import { TaskModal } from '@/components/TaskModal';
import { AIAssistantDrawer } from '@/components/AIAssistantDrawer';
import { ArchitectureModal } from '@/components/ArchitectureModal';
import { Task, TaskStatus } from '@/types';
import { loadTasksFromStorage, saveTasksToStorage, resetTasksToDefault } from '@/lib/storage';
import { initialTasks } from '@/lib/default-tasks';
import { Bot, Sparkles, Cloud, Github, ExternalLink, Server, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentView, setCurrentView] = useState<'kanban' | 'eisenhower' | 'telemetry' | 'analytics'>('kanban');
  
  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loaded = loadTasksFromStorage();
    setTasks(loaded);
  }, []);

  const updateTasksAndPersist = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasksToStorage(newTasks);
  };

  const handleTaskCreated = (newTask: Task) => {
    const updated = [newTask, ...tasks];
    updateTasksAndPersist(updated);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (newStatus === 'completed' && t.status !== 'completed') {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 }
            });
          } catch (e) {}
        }
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    updateTasksAndPersist(updated);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = t.subtasks.map(s => 
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        const allDone = newSubtasks.length > 0 && newSubtasks.every(s => s.completed);
        return {
          ...t,
          subtasks: newSubtasks,
          status: allDone ? ('completed' as TaskStatus) : t.status,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    updateTasksAndPersist(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    updateTasksAndPersist(updated);
  };

  const handleSaveTask = (savedTask: Task) => {
    const exists = tasks.some(t => t.id === savedTask.id);
    let updated: Task[];
    if (exists) {
      updated = tasks.map(t => t.id === savedTask.id ? savedTask : t);
    } else {
      updated = [savedTask, ...tasks];
    }
    updateTasksAndPersist(updated);
  };

  const handleResetTasks = () => {
    if (confirm('Reset to default Cloud Computing sample tasks?')) {
      const def = resetTasksToDefault();
      setTasks(def);
    }
  };

  const handleOpenTaskModal = (task: Task | null) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNewTaskModal={() => handleOpenTaskModal(null)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onResetTasks={handleResetTasks}
        taskCount={tasks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick AI Task Creator Section */}
        <QuickAITaskBar onTaskCreated={handleTaskCreated} />

        {/* Dynamic Views */}
        {currentView === 'kanban' && (
          <TaskBoard
            tasks={tasks}
            onOpenTaskModal={handleOpenTaskModal}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {currentView === 'eisenhower' && (
          <EisenhowerMatrix
            tasks={tasks}
            onUpdateTasks={updateTasksAndPersist}
            onOpenTaskModal={(t) => handleOpenTaskModal(t)}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {currentView === 'telemetry' && (
          <CloudTelemetryDashboard />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView tasks={tasks} />
        )}
      </main>

      {/* Floating AI Copilot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAICopilotOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-2xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="p-1 rounded-lg bg-white/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span>Ask CloudTask AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </button>
      </div>

      {/* Modals & Slide-over Drawers */}
      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <AIAssistantDrawer
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        tasks={tasks}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">CloudTask AI</span>
            <span>• Cloud Computing Academic Project</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://github.com/RohithSV2/AI-task-manager"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
            <span className="text-slate-800">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Vercel Serverless Ready (iad1)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
