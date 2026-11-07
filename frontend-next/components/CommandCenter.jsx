'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  Fish,
  FileCode,
  ScanFace,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Flame,
  Radio,
  Clock
} from 'lucide-react';

export default function CommandCenter({
  setActiveView,
  setSelectedIncidentId,
  backendUrl = 'http://127.0.0.1:8000'
}) {
  const [stats, setStats] = useState({
    totalScans: 14285,
    threatsPrevented: 1248,
    criticalIncidents: 2,
    activeIncidents: 3,
    activeIOCs: 6,
    systemHealth: 99.98
  });

  const [liveEvents, setLiveEvents] = useState([
    { id: 'ev-1', time: '12:14:02', vector: 'PHISHING', target: 'sovereign-vault-login.internal', status: 'BLOCKED', risk: 92, severity: 'CRITICAL' },
    { id: 'ev-2', time: '12:12:45', vector: 'MALWARE', target: 'invoice_2026.pdf.exe', status: 'QUARANTINED', risk: 86, severity: 'HIGH' },
    { id: 'ev-3', time: '12:08:19', vector: 'DEEPFAKE', target: 'ceo_urgent_memo.mp4', status: 'INTERCEPTED', risk: 91, severity: 'CRITICAL' },
    { id: 'ev-4', time: '12:05:30', vector: 'PHISHING', target: 'paypal-security-account.top', status: 'BLOCKED', risk: 98, severity: 'CRITICAL' },
    { id: 'ev-5', time: '12:01:12', vector: 'MALWARE', target: 'system_patch_v2.bin', status: 'CLEAN', risk: 8, severity: 'SAFE' }
  ]);

  useEffect(() => {
    // Fetch live stats from Django
    fetch(`${backendUrl}/api/v1/stats`)
      .then(res => res.json())
      .then(data => {
        if (data && data.totalScans) setStats(data);
      })
      .catch(() => {});

    // Fetch live telemetry stream
    fetch(`${backendUrl}/api/v1/live-monitor/stream`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveEvents(prev => [
            ...data.map(d => ({
              id: d.id,
              time: d.timestamp,
              vector: d.eventType,
              target: d.detail,
              status: 'FLAGGED',
              risk: 88,
              severity: d.severity
            })),
            ...prev
          ].slice(0, 8));
        }
      })
      .catch(() => {});
  }, [backendUrl]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-[#0f141e] border border-cyan-500/20 p-6 lg:p-8">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>HAWK Autonomous Defense Grid • All Sectors Nominal</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              SecOps Threat Command & AI Orchestration
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Real-time multi-vector threat prevention powered by <span className="text-cyan-400 font-semibold">PhishX</span>, <span className="text-amber-400 font-semibold">EMBER2024</span>, and <span className="text-purple-400 font-semibold">DeepGuard</span> on Neon PostgreSQL.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('phishx')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Fish className="w-4 h-4" />
              <span>Scan Phishing</span>
            </button>
            <button
              onClick={() => setActiveView('ember')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-amber-600/20 transition-all"
            >
              <FileCode className="w-4 h-4" />
              <span>Inspect Malware</span>
            </button>
            <button
              onClick={() => setActiveView('deepguard')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <ScanFace className="w-4 h-4" />
              <span>Detect DeepFake</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
            <span>Threats Neutralized</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            {stats.threatsPrevented.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>99.4% Automated Interception</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
            <span>Active Incidents</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            {stats.activeIncidents}
          </div>
          <div className="text-[11px] text-rose-400 font-mono mt-1 flex items-center space-x-1">
            <Flame className="w-3 h-3" />
            <span>2 Critical Priority Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
            <span>Total AI Inferences</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            {stats.totalScans.toLocaleString()}
          </div>
          <div className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Avg Latency: 18ms</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f141e] border border-[#1e2638] relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-gray-400 flex items-center justify-between">
            <span>Grid Reliability</span>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            {stats.systemHealth}%
          </div>
          <div className="text-[11px] text-blue-400 font-mono mt-1 flex items-center space-x-1">
            <span>Neon DB HA Cluster</span>
          </div>
        </div>
      </div>

      {/* 3 Core Vector Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PhishX Card */}
        <div
          onClick={() => setActiveView('phishx')}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#0f141e] to-[#0c1017] border border-[#1e2638] hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              VECTOR 01
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              PhishX Detection Engine
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Dual-layer LightGBM + 1D Character CNN. Extracts 36 lexical entropy attributes with calibrated probability.
            </p>
          </div>
          <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-xs text-cyan-400 font-mono">
            <span>Launch PhishX Scanner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* EMBER2024 Card */}
        <div
          onClick={() => setActiveView('ember')}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#0f141e] to-[#0c1017] border border-[#1e2638] hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20 transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <FileCode className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              VECTOR 02
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              EMBER2024 Malware Sandbox
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              14 benchmark LightGBM classifiers. Extracts 2,568 dimensions of byte histograms, entropy, and PE headers.
            </p>
          </div>
          <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-xs text-amber-400 font-mono">
            <span>Launch Malware Sandbox</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* DeepGuard Card */}
        <div
          onClick={() => setActiveView('deepguard')}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#0f141e] to-[#0c1017] border border-[#1e2638] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20 transition-all space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <ScanFace className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
              VECTOR 03
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              DeepGuard Synthetic Vision
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              MS-EffGCViT Vision Transformer. Inspects high-frequency Fourier spectra, face boundary blends, and audio harmonics.
            </p>
          </div>
          <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between text-xs text-purple-400 font-mono">
            <span>Launch DeepFake Vision</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Live Stream & Recent Incidents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Attack Telemetry Stream */}
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Live Attack Ingestion Feed
              </h2>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">Real-time Stream</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[300px] overflow-y-auto">
            {liveEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-lg bg-[#0a0d13] border border-[#1a2233] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="text-gray-500 text-[10px] shrink-0">{evt.time}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                      evt.vector === 'PHISHING'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : evt.vector === 'MALWARE'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {evt.vector}
                  </span>
                  <span className="text-gray-300 truncate text-[11px]">{evt.target}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 pl-2">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400'
                        : evt.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Investigations */}
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Priority SecOps Investigations</span>
            </h2>
            <button
              onClick={() => setActiveView('incidents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'INC-1024',
                title: 'Look-Alike Domain Credential Harvesting Campaign',
                type: 'PHISHING',
                risk: 92,
                status: 'INVESTIGATING',
                analyst: 'Sarah Jenkins'
              },
              {
                id: 'INC-1025',
                title: 'Polymorphic UPX Dropper in Invoice Archive',
                type: 'MALWARE',
                risk: 86,
                status: 'CONTAINED',
                analyst: 'David Miller'
              },
              {
                id: 'INC-1026',
                title: 'Synthetic Video Executive Impersonation ($250k Wire)',
                type: 'DEEPFAKE',
                risk: 91,
                status: 'INVESTIGATING',
                analyst: 'Sarah Jenkins'
              }
            ].map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncidentId(inc.id);
                  setActiveView('incidents');
                }}
                className="p-3.5 rounded-xl bg-[#0a0d13] border border-[#1a2233] hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{inc.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">
                      {inc.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        inc.status === 'CONTAINED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 group-hover:text-cyan-300 transition-colors font-medium">
                    {inc.title}
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono">
                    Assigned: {inc.analyst}
                  </p>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <div className="text-sm font-mono font-bold text-rose-400">
                    {inc.risk}/100
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">Risk Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

