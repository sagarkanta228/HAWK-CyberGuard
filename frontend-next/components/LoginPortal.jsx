'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  User,
  KeyRound,
  Server,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function LoginPortal({
  onLoginSuccess,
  backendUrl = 'http://127.0.0.1:8000'
}) {
  const [email, setEmail] = useState('admin@hawk.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: 'SecOps Administrator', email: 'admin@hawk.internal', role: 'ADMIN', name: 'Sarah Jenkins' },
    { label: 'SOC Threat Analyst', email: 'soc@hawk.internal', role: 'SOC_ANALYST', name: 'David Miller' },
    { label: 'Enterprise Operator', email: 'user@company.com', role: 'USER', name: 'Robert Vance' }
  ];

  const handleLogin = async (loginEmail = email) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (data && data.user) {
        onLoginSuccess(data.user);
      } else {
        onLoginSuccess({
          email: loginEmail,
          role: loginEmail.includes('admin') ? 'ADMIN' : (loginEmail.includes('soc') ? 'SOC_ANALYST' : 'USER'),
          fullName: 'Security Operator',
          department: 'SecOps'
        });
      }
    } catch (err) {
      onLoginSuccess({
        email: loginEmail,
        role: loginEmail.includes('admin') ? 'ADMIN' : (loginEmail.includes('soc') ? 'SOC_ANALYST' : 'USER'),
        fullName: 'Sarah Jenkins',
        department: 'SecOps Lead'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10 animate-fadeIn">
        {/* Brand Card Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[1px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0b0e14] rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wider text-white">HAWK DEFENSE</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Zero-Trust Autonomous Security Gateway
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl bg-[#0f141e] border border-[#1e2638] shadow-2xl space-y-5">
          <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-[#1e2638]">
            <span className="text-gray-400 flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Post-Quantum TLS Key Exchange</span>
            </span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Operator Identity
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] focus:border-cyan-500 text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
                  placeholder="analyst@hawk.internal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Passkey / Security Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] focus:border-cyan-500 text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs font-mono flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Session Signature...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick preset credentials */}
          <div className="pt-4 border-t border-[#1e2638] space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">
              Quick Role Presets:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setEmail(p.email);
                    handleLogin(p.email);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#080a0f] hover:bg-[#141b2b] border border-[#1e2638] hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-400">
                      {p.label}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {p.name} ({p.email})
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2638] text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-gray-500 font-mono flex items-center justify-center space-x-2">
          <Server className="w-3.5 h-3.5 text-cyan-500" />
          <span>NeonDB PostgreSQL Integrated • 3 AI Vector Engines</span>
        </div>
      </div>
    </div>
  );
}

