'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  Trash2
} from 'lucide-react';
import { Task, ChatMessage } from '@/types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddTask?: (task: Task) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  onAddTask
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `👋 **Hi there! I'm TaskMaster AI**, your personal productivity coach. 

I can analyze your ${tasks.length} active tasks, organize your daily schedule, help you prioritize with the Eisenhower Matrix, or break down big goals into manageable steps.

How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '📋 Plan my day with a quick briefing',
    '💡 Which task should I tackle right now?',
    '⚡ How can I prioritize my week better?',
    '🎯 Break down my biggest project'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          tasks,
          history: messages.slice(-4)
        })
      });

      const data = await res.json();
      const replyContent = data.reply || "I've analyzed your task list. Keep taking action on your top priorities!";

      const aiMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_ai',
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          role: 'assistant',
          content: '⚠️ Assistant temporarily busy. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/30 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E4DA] shadow-warm-lg flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-[#FAF9F6] border-b border-[#F1EDE4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-stone-900 text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  TaskMaster AI Copilot
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[10px] text-stone-500">
                  Smart Planning & Productivity Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#F1EDE4]"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#F1EDE4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-[#FAF9F6] border-b border-[#F1EDE4] overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-[#F4F1EA] border border-[#E8E4DA] text-stone-700 text-[11px] transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F6]/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-warm-sm ${
                    m.role === 'user'
                      ? 'bg-stone-900 text-white rounded-br-none'
                      : 'bg-white border border-[#E8E4DA] text-stone-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose-stone">
                    {m.content}
                  </div>
                  <div className={`text-[9px] mt-1 text-right ${m.role === 'user' ? 'text-stone-400' : 'text-stone-400'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-2.5 rounded-xl border border-[#E8E4DA] w-fit shadow-warm-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>TaskMaster AI is planning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3.5 bg-white border-t border-[#F1EDE4]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about planning, tasks, or subtasks..."
                disabled={loading}
                className="flex-1 bg-[#FAF9F6] border border-[#E5E0D4] rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
