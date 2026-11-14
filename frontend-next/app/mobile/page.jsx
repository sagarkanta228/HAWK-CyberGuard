'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import {
  Smartphone,
  Shield,
  Columns,
  Download,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import MobileDeviceShell from '../../components/mobile/MobileDeviceShell';
import MobileSignInScreen from '../../components/mobile/MobileSignInScreen';
import MobileScanScreen from '../../components/mobile/MobileScanScreen';
import MobileAlertsScreen from '../../components/mobile/MobileAlertsScreen';

export default function MobileAppSuitePage() {
  const [activeTab, setActiveTab] = useState('scan'); // 'login' | 'scan' | 'alerts' | 'all'
  const [showFrame, setShowFrame] = useState(true);
  const [showApkModal, setShowApkModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const gradleCommand = `cd c:\\Users\\USER\\Desktop\\ASTRA\\HAWK-CyberGuard\\mobile-app
npm run build:apk`;

  const copyCommand = () => {
    navigator.clipboard.writeText(gradleCommand);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back Link & Title */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>HAWK Web</span>
          </a>

          <div className="h-4 w-[1px] bg-white/15" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#2454ff] flex items-center justify-center text-white">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              HAWK Mobile App (.APK Edition)
            </span>
          </div>
        </div>

        {/* Middle: Screen Switcher Tabs */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-[#2454ff] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            1. Welcome Back
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'scan'
                ? 'bg-[#2454ff] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            2. Security Scan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'alerts'
                ? 'bg-[#2454ff] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            3. Alerts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#7c3aed] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>All 3 Side-by-Side</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            type="button"
            onClick={() => setShowFrame(!showFrame)}
            className="text-xs text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            {showFrame ? 'Frameless' : 'Show Device Frame'}
          </button>

          {/* Export / Download APK Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#2454ff] to-[#3b82f6] hover:from-[#1a44e5] hover:to-[#2563eb] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md shadow-[#2454ff]/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Build &amp; Install APK</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-x-auto p-4 sm:p-8 flex items-center justify-center">
        {activeTab === 'all' ? (
          /* Side-by-side view showing all 3 screens simultaneously */
          <div className="flex flex-wrap items-start justify-center gap-8 py-6 max-w-7xl mx-auto">
            {/* Screen 1: Welcome Back */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#93c5fd] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                SCREEN 1 · AUTH / SIGN IN
              </span>
              <MobileDeviceShell showFrame={showFrame}>
                <MobileSignInScreen onNavigate={(s) => setActiveTab(s)} />
              </MobileDeviceShell>
            </div>

            {/* Screen 2: Security Scan */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#86efac] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                SCREEN 2 · RADIAL SECURITY SCAN
              </span>
              <MobileDeviceShell showFrame={showFrame}>
                <MobileScanScreen onNavigate={(s) => setActiveTab(s)} />
              </MobileDeviceShell>
            </div>

            {/* Screen 3: Alerts */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#fca5a5] bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                SCREEN 3 · REAL-TIME ALERTS
              </span>
              <MobileDeviceShell showFrame={showFrame}>
                <MobileAlertsScreen onNavigate={(s) => setActiveTab(s)} />
              </MobileDeviceShell>
            </div>
          </div>
        ) : (
          /* Single screen focused view */
          <div className="w-full flex flex-col items-center justify-center py-4">
            <MobileDeviceShell showFrame={showFrame}>
              {activeTab === 'login' && (
                <MobileSignInScreen onNavigate={(s) => setActiveTab(s)} />
              )}
              {activeTab === 'scan' && (
                <MobileScanScreen onNavigate={(s) => setActiveTab(s)} />
              )}
              {activeTab === 'alerts' && (
                <MobileAlertsScreen onNavigate={(s) => setActiveTab(s)} />
              )}
            </MobileDeviceShell>
          </div>
        )}
      </main>

      {/* APK Export & Install Modal */}
      {showApkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2454ff] flex items-center justify-center text-white">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Android .APK Package &amp; Install
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Deploy HAWK CyberGuard Mobile directly to Android devices
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApkModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Methods */}
            <div className="space-y-4">
              {/* Method 1: Instant PWA / WebAPK */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#86efac] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Method 1: Instant 1-Click
                    Native Install (No Android Studio required)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-[#86efac] px-2 py-0.5 rounded-full font-mono">
                    FASTEST
                  </span>
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Open <code>http://&lt;your-local-ip&gt;:3000/mobile</code> on Chrome
                  or Edge on your Android phone. Tap the 3 dots menu &rarr;{' '}
                  <strong className="text-white">“Add to Home Screen”</strong> or{' '}
                  <strong className="text-white">“Install App”</strong>. Android
                  automatically packages and installs it as a standalone native
                  WebAPK with home screen icon!
                </p>
              </div>

              {/* Method 2: Offline Native Gradle / Capacitor APK */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#93c5fd] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Method 2: Compile Debug
                    .APK with Gradle / Capacitor
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-[#93c5fd] px-2 py-0.5 rounded-full font-mono">
                    STANDALONE APK
                  </span>
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  The native project scaffold is located at{' '}
                  <code>HAWK-CyberGuard/mobile-app</code>. Run the command below to
                  sync assets and produce <code>app-debug.apk</code>:
                </p>
                <div className="bg-black/50 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-[#93c5fd] border border-white/10">
                  <span className="truncate">{gradleCommand}</span>
                  <button
                    type="button"
                    onClick={copyCommand}
                    className="ml-3 shrink-0 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Links */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-[#94a3b8]">Direct Screen Links:</span>
              <div className="flex items-center gap-3">
                <a
                  href="/mobile/login"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#93c5fd] hover:underline flex items-center gap-1"
                >
                  /login <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/mobile/scan"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#93c5fd] hover:underline flex items-center gap-1"
                >
                  /scan <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="/mobile/alerts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#93c5fd] hover:underline flex items-center gap-1"
                >
                  /alerts <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
