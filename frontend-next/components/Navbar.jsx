'use client';

import React from 'react';
import { Shield, Activity, Zap, Play, LogOut, User, Server } from 'lucide-react';

export default function Navbar({
  currentRole,
  setCurrentRole,
  activeView,
  setActiveView,
  onOpenDemo,
  onLogout,
  systemStatus
}) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#080a0f]/90 backdrop-blur-md border-b border-[#1e2638] z-50 px-4 lg:px-8 flex items-center justify-between">
      {/* Brand & Emblem */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveView('command-center')}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#0b0e14] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-white">HAWK</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                v4.0 AI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-tight">Multi-Vector Threat Defense</p>
          </div>
        </button>

        {/* Engine status indicator pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0f141e] border border-[#1e2638] text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-gray-300 font-mono text-[11px]">3 ENGINES ACTIVE</span>
          <span className="text-gray-600">|</span>
          <Server className="w-3 h-3 text-cyan-400" />
          <span className="text-cyan-400 font-mono text-[11px]">NEON POSTGRES</span>
        </div>
      </div>

      {/* Center live badge */}
      <div className="hidden xl:flex items-center space-x-6 text-xs text-gray-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="text-cyan-400 font-semibold">PhishX:</span>
          <span>LightGBM+CharCNN</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-amber-400 font-semibold">EMBER2024:</span>
          <span>14 LGBM Classifiers</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-purple-400 font-semibold">DeepGuard:</span>
          <span>MS-EffGCViT</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Interactive Demo Runner Button */}
        <button
          onClick={onOpenDemo}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
          <span>Simulate Attack</span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center rounded-lg bg-[#0f141e] border border-[#1e2638] p-0.5 text-xs font-mono">
          <button
            onClick={() => setCurrentRole('USER')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentRole === 'USER'
                ? 'bg-blue-600 text-white font-semibold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            USER
          </button>
          <button
            onClick={() => setCurrentRole('SOC_ANALYST')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentRole === 'SOC_ANALYST'
                ? 'bg-amber-600 text-white font-semibold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SOC
          </button>
          <button
            onClick={() => setCurrentRole('ADMIN')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentRole === 'ADMIN'
                ? 'bg-cyan-600 text-white font-semibold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ADMIN
          </button>
        </div>

        {/* Profile / Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1e2638]">
          <div className="w-8 h-8 rounded-lg bg-[#141b2b] border border-[#22304d] flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <button
            onClick={onLogout}
            title="Disconnect Zero-Trust Session"
            className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

