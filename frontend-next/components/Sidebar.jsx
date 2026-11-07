'use client';

import React from 'react';
import {
  LayoutDashboard,
  Fish,
  FileCode,
  ScanFace,
  ShieldAlert,
  Globe,
  Bot,
  ClipboardList,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';

export default function Sidebar({
  currentRole,
  activeView,
  setActiveView,
  onLogout
}) {
  const navItems = [
    {
      id: 'command-center',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'phishx',
      label: 'PhishX Shield',
      icon: Fish,
      sublabel: 'LightGBM + CharCNN',
      badge: 'VECTOR 1',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      id: 'ember',
      label: 'EMBER2024 Sandbox',
      icon: FileCode,
      sublabel: '14 LGBM Classifiers',
      badge: 'VECTOR 2',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'deepguard',
      label: 'DeepGuard Vision',
      icon: ScanFace,
      sublabel: 'MS-EffGCViT Hybrid',
      badge: 'VECTOR 3',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'incidents',
      label: 'Incident Forensics',
      icon: ShieldAlert,
      badge: '3 QUEUED',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'threat-intel',
      label: 'Threat Intelligence',
      icon: Globe,
      sublabel: 'IOC Feed & Att&ck',
      badge: '6 ACTIVE',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'copilot',
      label: 'AI Security Copilot',
      icon: Bot,
      sublabel: 'Autonomous SOC Lead',
      badge: 'AI',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'audit-logs',
      label: 'Audit Trail & Telemetry',
      icon: ClipboardList,
      sublabel: 'Immutable Audit Log'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#080a0f] border-r border-[#1e2638] flex flex-col justify-between p-4 z-40 overflow-y-auto">
      <div className="space-y-6">
        {/* Section title */}
        <div>
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold mb-2">
            Defense Matrix
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/30 text-white border border-cyan-500/30 shadow-lg shadow-cyan-950/30 font-medium'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-[#0f141e] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-cyan-500 text-black'
                          : 'bg-[#141b2b] text-gray-400 group-hover:text-cyan-400 group-hover:bg-[#1c263c]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.label}</div>
                      {item.sublabel && (
                        <div className="text-[10px] text-gray-500 font-mono leading-none mt-0.5">
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Engine Status Hardware Telemetry Box */}
      <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#0f141e] to-[#0c0f17] border border-[#1e2638] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-gray-300 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Node Specs</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            100% ONLINE
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-gray-400">
          <div className="flex justify-between">
            <span>PhishX:</span>
            <span className="text-cyan-400">Calibrated CV</span>
          </div>
          <div className="flex justify-between">
            <span>EMBER2024:</span>
            <span className="text-amber-400">14 Boosters</span>
          </div>
          <div className="flex justify-between">
            <span>DeepGuard:</span>
            <span className="text-purple-400">GCViT B0/B5</span>
          </div>
          <div className="flex justify-between">
            <span>Database:</span>
            <span className="text-emerald-400">Neon v18.6</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

