'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bot,
  ClipboardList,
  Cpu,
  FileCode,
  Fish,
  Globe,
  LayoutDashboard,
  ScanFace,
  ShieldAlert,
} from 'lucide-react';

export const CONSOLE_NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      {
        id: 'command-center',
        href: '/console',
        label: 'Command Center',
        icon: LayoutDashboard,
        badge: 'LIVE',
      },
    ],
  },
  {
    title: 'AI Detection Vectors',
    items: [
      {
        id: 'phishx',
        href: '/console/phishx',
        label: 'PhishX Shield',
        sublabel: 'LightGBM + CharCNN',
        icon: Fish,
        badge: '01',
      },
      {
        id: 'ember',
        href: '/console/ember',
        label: 'EMBER2024 Sandbox',
        sublabel: '14 LGBM Classifiers',
        icon: FileCode,
        badge: '02',
      },
      {
        id: 'deepguard',
        href: '/console/deepguard',
        label: 'DeepGuard Vision',
        sublabel: 'MS-EffGCViT ViT',
        icon: ScanFace,
        badge: '03',
      },
    ],
  },
  {
    title: 'SecOps & Forensics',
    items: [
      {
        id: 'incidents',
        href: '/console/incidents',
        label: 'Incident Forensics',
        sublabel: 'MITRE ATT&CK',
        icon: ShieldAlert,
        badge: '3',
        badgeAlert: true,
      },
      {
        id: 'threat-intel',
        href: '/console/threat-intel',
        label: 'Threat Intelligence',
        sublabel: 'IOC Database',
        icon: Globe,
      },
      {
        id: 'copilot',
        href: '/console/copilot',
        label: 'AI Security Copilot',
        sublabel: 'SOC Assistant',
        icon: Bot,
      },
      {
        id: 'audit-logs',
        href: '/console/audit-logs',
        label: 'Audit Trail',
        sublabel: 'Immutable Telemetry',
        icon: ClipboardList,
      },
    ],
  },
];

export default function Sidebar({ activeView }) {
  return (
    <>
      {/* Desktop Architectural Rail */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0d0f13]/95 backdrop-blur-xl border-r border-white/[0.08] hidden lg:flex flex-col justify-between p-4 z-40 overflow-y-auto">
        <div className="space-y-6">
          {CONSOLE_NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-semibold mb-2">
                {group.title}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors group ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-pill"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/[0.1] via-white/[0.05] to-transparent border border-white/20"
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-[5px] transition-all duration-200 shrink-0 ${
                            isActive
                              ? 'bg-slate-200 text-[#0d0f13]'
                              : 'bg-[#14171f] text-slate-400 border border-white/[0.08] group-hover:text-white group-hover:border-white/20'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight truncate">
                            {item.label}
                          </div>
                          {item.sublabel && (
                            <div className="text-[10px] text-slate-500 font-mono leading-none mt-1 truncate">
                              {item.sublabel}
                            </div>
                          )}
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`relative z-10 text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] border uppercase font-semibold shrink-0 ${
                            item.badgeAlert
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : isActive
                              ? 'bg-white/15 text-white border-white/25'
                              : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Hardware Spec Box matching Main Dashboard Matrix */}
        <div className="p-3.5 rounded-xl bg-[#14171f] bg-plus-matrix border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider text-white font-semibold">
              <Cpu className="w-3.5 h-3.5 text-slate-300" />
              <span>AI Node Cluster</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>PhishX</span>
              <span className="text-slate-200">LGBM + CharCNN</span>
            </div>
            <div className="flex justify-between">
              <span>EMBER2024</span>
              <span className="text-slate-200">14 Boosters</span>
            </div>
            <div className="flex justify-between">
              <span>DeepGuard</span>
              <span className="text-slate-200">MS-EffGCViT</span>
            </div>
            <div className="flex justify-between">
              <span>PostgreSQL</span>
              <span className="text-slate-200">Neon v18.6</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0f13]/95 backdrop-blur-xl border-t border-white/[0.08] z-50 px-2 flex items-center justify-around">
        {[
          { id: 'command-center', href: '/console', label: 'Center', icon: LayoutDashboard },
          { id: 'phishx', href: '/console/phishx', label: 'PhishX', icon: Fish },
          { id: 'ember', href: '/console/ember', label: 'EMBER', icon: FileCode },
          { id: 'deepguard', href: '/console/deepguard', label: 'DeepFake', icon: ScanFace },
          { id: 'incidents', href: '/console/incidents', label: 'SOC', icon: ShieldAlert },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
