'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  Zap, 
  Layers, 
  CheckCircle2,
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
      content: `👋 **Hello! I'm CloudTask AI**, your autonomous cloud engineering and task copilot. 

I can analyze your ${tasks.length} active tasks, provide daily standup summaries, auto-prioritize sprint goals, or break down cloud infrastructure epics. 

Click one of the suggested prompts below or ask me anything!`,
      timestamp: new Date().toLocaleTimeString()
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
    '📋 Generate my Daily Standup Briefing',
    '💡 Which task should I tackle right now?',
    '☁️ Explain the Cloud Architecture of this app',
    '⚡ How can we reduce serverless cold starts?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
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
      const replyContent = data.reply || "I've analyzed your cloud project tasks. Everything is running within SLA.";

      const aiMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_ai',
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          role: 'assistant',
          content: '⚠️ Cloud inference timeout. Please ensure network connectivity and retry.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  CloudTask AI Copilot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Google Gemini & Serverless LLM Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose-invert">
                    {m.content}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1.5 text-right opacity-70">
                    {m.timestamp}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>CloudTask AI is reasoning over task vector index...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800">
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
                placeholder="Ask about your cloud project or tasks..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
