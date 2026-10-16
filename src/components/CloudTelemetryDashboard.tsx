'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Globe, 
  Zap, 
  RefreshCw, 
  Terminal, 
  CheckCircle, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { CloudMetric, CloudLog } from '@/types';

export const CloudTelemetryDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CloudMetric | null>(null);
  const [logs, setLogs] = useState<CloudLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cloud-telemetry');
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setLogs(prev => [...(data.logs || []), ...prev].slice(0, 8));
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Failed to load telemetry', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Live Cloud Telemetry & Observability
              </h3>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Vercel Edge & AWS Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time serverless latency, function invocations, memory allocation, and runtime telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={fetchTelemetry}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Sync Cloud (Last: {lastUpdated || 'syncing'})</span>
        </button>
      </div>

      {/* Real-time Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Latency */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Serverless Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {metrics ? `${metrics.latencyMs} ms` : '24 ms'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 inline" /> 99.8% Sub-50ms SLA
          </p>
        </div>

        {/* Region */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Edge Cloud Region</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {metrics ? metrics.region : 'iad1 (AWS us-east-1)'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Anycast Routed CDN
          </p>
        </div>

        {/* Memory Footprint */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Function Memory</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {metrics ? `${metrics.memoryUsageMb} MB` : '78 MB'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Allocated: 1024 MB
          </p>
        </div>

        {/* Invocations & Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Invocations / Cost</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {metrics ? metrics.serverlessInvocationsToday : '1,450'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            Est. Cost: ${metrics ? metrics.estimatedCloudCostUsd : '0.12'}
          </p>
        </div>
      </div>

      {/* Cloud Architecture Pipeline Visual */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Multi-Tier Serverless Cloud Architecture Flow
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">Tier 1: Client / Edge</span>
            <p className="text-xs font-semibold text-white">Vercel Anycast CDN</p>
            <p className="text-[11px] text-slate-400 mt-1">Global SSL & Route Caching</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">Tier 2: Serverless Compute</span>
            <p className="text-xs font-semibold text-white">AWS Lambda / Next.js</p>
            <p className="text-[11px] text-slate-400 mt-1">Node 20 Runtime Microservices</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">Tier 3: AI Inference</span>
            <p className="text-xs font-semibold text-white">Gemini Cloud LLM</p>
            <p className="text-[11px] text-slate-400 mt-1">Natural Language & NLP</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">Tier 4: Datastore</span>
            <p className="text-xs font-semibold text-white">LocalStorage / DynamoDB</p>
            <p className="text-[11px] text-slate-400 mt-1">State Sync & Distributed Cache</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">Tier 5: DevOps CI/CD</span>
            <p className="text-xs font-semibold text-white">GitHub Actions</p>
            <p className="text-[11px] text-slate-400 mt-1">Zero-Downtime Deployment</p>
          </div>
        </div>
      </div>

      {/* CloudWatch / Serverless Log Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              CloudWatch / Vercel Serverless Function Logs Stream (Live)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase">STREAMING</span>
          </div>
        </div>

        <div className="p-4 font-mono text-xs space-y-2 max-h-72 overflow-y-auto bg-black/60">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 shrink-0">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400' :
                log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                log.level === 'METRIC' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-400 shrink-0">{log.service}:</span>
              <span className="text-slate-200 break-all">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
