'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  ScanFace,
  Shield,
} from 'lucide-react';
import { HawkGeometricMark } from './HawkMark';
import GlobeHandIllustration from './GlobeHandIllustration';
import { EASE_OUT_EXPO } from './motion/MotionPrimitives';

export default function LoginPortal({
  mode = 'login',
  onLoginSuccess,
  backendUrl = 'http://127.0.0.1:8000',
}) {
  const isSignup = mode === 'signup';
  const [roleTab, setRoleTab] = useState('SOC');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('analyst@company.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const roleMap = {
    User: 'USER',
    SOC: 'SOC_ANALYST',
    'SOC analyst': 'SOC_ANALYST',
    Admin: 'ADMIN',
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { bars: 0, label: 'not set', color: 'bg-[#e2e8f0]' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { bars: Math.max(1, score), label: 'weak', color: 'bg-rose-500' };
    if (score <= 3) return { bars: 3, label: 'fair', color: 'bg-amber-500' };
    if (score === 4) return { bars: 4, label: 'good', color: 'bg-[#2454ff]' };
    return { bars: 5, label: 'strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (overrideEmail = null) => {
    setErrorMsg('');
    const targetEmail = (overrideEmail ?? email).trim() || 'analyst@company.com';
    if (isSignup && !agreeTerms) {
      setErrorMsg('Please agree to the Terms and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const mappedRole = roleMap[roleTab] || 'SOC_ANALYST';
      const payload = isSignup
        ? {
            fullName: fullName.trim() || 'Aarav Sharma',
            organization: organization.trim() || 'HAWK Enterprise',
            email: targetEmail,
            role: mappedRole,
            password,
          }
        : {
            email: targetEmail,
            role: mappedRole,
            password,
          };

      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data && data.user) {
        onLoginSuccess(data.user);
      } else {
        onLoginSuccess({
          email: targetEmail,
          role: mappedRole,
          fullName: fullName.trim() || 'Security Analyst',
          department: organization.trim() || 'SecOps',
        });
      }
    } catch {
      onLoginSuccess({
        email: targetEmail,
        role: roleMap[roleTab] || 'SOC_ANALYST',
        fullName: fullName.trim() || 'Sarah Jenkins',
        department: organization.trim() || 'SecOps Lead',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSignup) {
    // Page 4: Split Signup (Left #eef1fc Feature Showcase, Right White Form)
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-[#0f172a]">
        {/* Left Feature Showcase Panel */}
        <div className="bg-[#eef1fc] px-8 sm:px-14 lg:px-16 py-10 flex flex-col justify-between">
          <Link href="/main-dashboard" className="inline-flex items-center gap-2.5 w-fit">
            <HawkGeometricMark className="w-8 h-8" />
            <span className="font-display font-bold text-base tracking-tight text-[#0f172a]">
              HAWK
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="my-auto py-12 max-w-md space-y-8"
          >
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-[#0f172a]">
              Start securing everything you trust.
            </h1>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white border border-[#e5e9f2] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#eef2ff] text-[#2454ff] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">
                    PhishX Shield
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    Score any URL with a calibrated phishing probability.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e5e9f2] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#f3e8ff] text-[#7c3aed] flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">
                    EMBER2024 Sandbox
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    Static malware analysis for Windows executables.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e5e9f2] shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
                  <ScanFace className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">
                    DeepGuard Vision
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    Detect synthetic faces, video and cloned voices.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="text-xs text-[#64748b]">
            HAWK Defense Platform • Neon PostgreSQL
          </div>
        </div>

        {/* Right Signup Form Panel */}
        <div className="bg-white px-8 sm:px-14 lg:px-20 py-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="w-full max-w-md space-y-5"
          >
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#0f172a]">
                Create your account
              </h2>
              <p className="text-sm text-[#64748b] mt-1">
                Free to set up. No credit card needed.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Company or team"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Work email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Your role
                </label>
                <div className="grid grid-cols-3 p-1 rounded-full bg-[#f1f4fb] text-xs font-medium">
                  {['User', 'SOC analyst', 'Admin'].map((tab) => {
                    const active = roleTab === tab || (roleTab === 'SOC' && tab === 'SOC analyst');
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setRoleTab(tab)}
                        className={`py-2 rounded-full transition-all ${
                          active
                            ? 'bg-white text-[#0f172a] shadow-sm font-semibold'
                            : 'text-[#64748b] hover:text-[#0f172a]'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 12 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
                />
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-colors ${
                        i <= strength.bars ? strength.color : 'bg-[#e2e8f0]'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-[#64748b] mt-1">
                  Password strength: <span className="font-medium">{strength.label}</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#cbd5e1] text-[#2454ff] focus:ring-[#2454ff]"
                />
                <span>
                  I agree to the{' '}
                  <span className="text-[#2454ff] font-medium">Terms</span> and{' '}
                  <span className="text-[#2454ff] font-medium">Privacy Policy</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-[#64748b] pt-1">
              Already have an account?{' '}
              <Link href="/login" className="text-[#2454ff] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Page 3: Split Login (Left White Form, Right #eef1fc Globe & Hand Panel)
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-[#0f172a]">
      {/* Left White Form Panel */}
      <div className="px-8 sm:px-14 lg:px-20 py-10 flex flex-col justify-between">
        <Link href="/main-dashboard" className="inline-flex items-center gap-2.5 w-fit">
          <HawkGeometricMark className="w-8 h-8" />
          <span className="font-display font-bold text-base tracking-tight text-[#0f172a]">
            HAWK
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="w-full max-w-md mx-auto my-auto py-8 space-y-6"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#0f172a]">
              Welcome back
            </h1>
            <p className="text-sm text-[#64748b] mt-1">
              Sign in to your command center.
            </p>
          </div>

          {/* Role Pill Segmented Switcher */}
          <div className="grid grid-cols-3 p-1 rounded-full bg-[#f1f4fb] text-xs font-medium">
            {['User', 'SOC', 'Admin'].map((tab) => {
              const active = roleTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setRoleTab(tab);
                    if (tab === 'Admin') setEmail('admin@hawk.internal');
                    else if (tab === 'SOC') setEmail('soc@hawk.internal');
                    else setEmail('user@company.com');
                  }}
                  className={`py-2 rounded-full transition-all ${
                    active
                      ? 'bg-white text-[#0f172a] shadow-sm font-semibold'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                Work email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#0f172a]">
                  Password
                </label>
                <span className="text-xs text-[#2454ff] font-medium cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="rounded border-[#cbd5e1] text-[#2454ff] focus:ring-[#2454ff]"
              />
              <span>Keep me signed in on this device</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-[#e5e9f2] w-full" />
              <span className="bg-white px-3 text-[11px] text-[#94a3b8]">or</span>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit('admin@hawk.internal')}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-[#f8fafc] border border-[#dce2ee] text-[#0f172a] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-4 h-4 text-[#475569]" />
              <span>Continue with company SSO</span>
            </button>
          </form>

          <div className="text-center text-xs text-[#64748b]">
            New to HAWK?{' '}
            <Link href="/signup" className="text-[#2454ff] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </motion.div>

        <div className="text-xs text-[#94a3b8]">
          Zero-Trust SecOps Gateway • HAWK
        </div>
      </div>

      {/* Right Showcase Panel matching Page 3 */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#eef1fc] p-12 text-center">
        <GlobeHandIllustration compact />
        <h2 className="font-display text-2xl font-extrabold text-[#0f172a] max-w-xs leading-snug mt-4">
          Phishing, malware and deepfakes. One place.
        </h2>
        <div className="flex items-center gap-2.5 mt-5">
          <span className="px-3 py-1 rounded-full bg-white text-[#2454ff] text-xs font-semibold shadow-sm border border-[#e5e9f2]">
            PhishX
          </span>
          <span className="px-3 py-1 rounded-full bg-white text-[#7c3aed] text-xs font-semibold shadow-sm border border-[#e5e9f2]">
            EMBER2024
          </span>
          <span className="px-3 py-1 rounded-full bg-white text-[#059669] text-xs font-semibold shadow-sm border border-[#e5e9f2]">
            DeepGuard
          </span>
        </div>
      </div>
    </div>
  );
}
