'use client';

import React, { useState } from 'react';
import {
  Bell,
  Home,
  Shield,
  LayoutGrid,
  Settings,
  Check,
  Send,
  MessageSquare,
  PhoneCall,
  Camera
} from 'lucide-react';

export default function MobileAlertsScreen({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [resolvedIds, setResolvedIds] = useState(new Set());

  const initialAlerts = [
    {
      id: 'alert-1',
      app: 'instagram',
      title: 'Fraud Alert',
      subtitle: 'Facebook • 10 Minute a...',
      riskLevel: 'High Risk',
      action: 'RESOLVE',
      actionType: 'button',
    },
    {
      id: 'alert-2',
      app: 'whatsapp',
      title: 'High-Risk Warning',
      subtitle: 'Call • 1 hours ago',
      riskLevel: 'Medium Risk',
      actionType: 'pill',
    },
    {
      id: 'alert-3',
      app: 'facebook',
      title: 'Threat Detected',
      subtitle: 'Call • 1 hours ago',
      riskLevel: 'Medium Risk',
      actionType: 'pill',
    },
    {
      id: 'alert-4',
      app: 'telegram',
      title: 'Threat Detected',
      subtitle: 'Call • 1 hours ago',
      riskLevel: 'Medium Risk',
      actionType: 'pill',
    },
    {
      id: 'alert-5',
      app: 'sms',
      title: 'Threat Detected',
      subtitle: 'SMS • 2 hours ago',
      riskLevel: 'High Risk',
      actionType: 'pill',
    },
  ];

  const handleResolve = (id) => {
    setResolvedIds((prev) => new Set([...prev, id]));
  };

  const filteredAlerts = initialAlerts.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.riskLevel === activeFilter;
  });

  return (
    <div className="w-full h-full min-h-screen bg-[#f7f9fc] flex flex-col justify-between pb-28 select-none">
      {/* Main Content Area */}
      <div className="px-5 pt-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight">
            Alerts
          </h1>
          <button
            type="button"
            className="w-11 h-11 rounded-full bg-white shadow-sm border border-[#eef2f7] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#334155]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#2454ff] ring-2 ring-white" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'High Risk', 'Medium Risk', 'Low Risk'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2454ff] text-white shadow-md shadow-[#2454ff]/30'
                    : 'bg-white text-[#64748b] border border-[#e2e8f0] shadow-sm hover:border-[#cbd5e1]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mt-4">
          {filteredAlerts.map((alert) => {
            const isResolved = resolvedIds.has(alert.id);

            return (
              <div
                key={alert.id}
                className="w-full bg-white rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#eef2f7] flex items-center justify-between hover:border-[#dbeafe] transition-all"
              >
                {/* Left: App Icon & Details */}
                <div className="flex items-center gap-3.5">
                  {/* App Icon */}
                  {alert.app === 'instagram' && (
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] flex items-center justify-center text-white shadow-sm shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}

                  {alert.app === 'whatsapp' && (
                    <div className="w-11 h-11 rounded-2xl bg-[#25d366] flex items-center justify-center text-white shadow-sm shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                  )}

                  {alert.app === 'facebook' && (
                    <div className="w-11 h-11 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
                      f
                    </div>
                  )}

                  {alert.app === 'telegram' && (
                    <div className="w-11 h-11 rounded-full bg-[#229ed9] flex items-center justify-center text-white shadow-sm shrink-0">
                      <Send className="w-5 h-5 -rotate-45" />
                    </div>
                  )}

                  {alert.app === 'sms' && (
                    <div className="w-11 h-11 rounded-2xl bg-[#f43f5e] flex items-center justify-center text-white shadow-sm shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  )}

                  {/* Texts */}
                  <div>
                    <div className="text-[14px] font-bold text-[#0f172a] leading-tight">
                      {alert.title}
                    </div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5 font-normal">
                      {alert.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right: Action or Risk Pill */}
                <div>
                  {alert.actionType === 'button' ? (
                    isResolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-3.5 py-1.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" /> Resolved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResolve(alert.id)}
                        className="border border-[#34d399] text-[#059669] hover:bg-[#ecfdf5] text-[11px] font-bold px-4 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
                      >
                        RESOLVE
                      </button>
                    )
                  ) : alert.riskLevel === 'High Risk' ? (
                    <span className="bg-[#fef2f2] text-[#ef4444] text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-[#fee2e2]">
                      High Risk
                    </span>
                  ) : (
                    <span className="bg-[#eff6ff] text-[#2454ff] text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-[#dbeafe]">
                      Medium Risk
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-5 left-5 right-5 max-w-sm mx-auto z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.09)] py-2 px-6 flex justify-between items-center border border-[#eef2f7]">
          {/* Home */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('login')}
            className="p-2 text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Alerts (Active) */}
          <button
            type="button"
            className="bg-[#2454ff] text-white px-4 py-2 rounded-full flex items-center gap-1.5 text-[12px] font-semibold shadow-md shadow-[#2454ff]/30"
          >
            <Shield className="w-4 h-4" />
            <span>Alerts</span>
          </button>

          {/* Grid / Scan */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('scan')}
            className="p-2 text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            aria-label="Scan"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            type="button"
            className="p-2 text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
