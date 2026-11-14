'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function MobileSignInScreen({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignedIn(true);
    setTimeout(() => {
      if (onNavigate) onNavigate('scan');
    }, 600);
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#f2f6fd] via-white to-white flex flex-col justify-between px-6 pt-10 pb-8 select-none">
      {/* Top Section */}
      <div className="flex flex-col items-center w-full max-w-sm mx-auto">
        {/* Shield Icon Badge */}
        <div className="relative mt-2">
          {/* Subtle blue ambient glow */}
          <div className="absolute -inset-2 bg-blue-500/25 rounded-3xl blur-xl" />
          <div className="relative w-[76px] h-[76px] rounded-[24px] bg-[#2454ff] flex items-center justify-center shadow-[0_12px_28px_rgba(36,84,255,0.35)]">
            <div className="relative flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 text-white stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight mt-6 text-center">
          Welcome Back
        </h1>
        <p className="text-[13px] text-[#94a3b8] font-normal text-center mt-1 mb-7">
          Sign up to protect your device
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e293b] mb-2">
              Email
            </label>
            <div className="flex items-center w-full bg-white rounded-2xl border border-[#e2e8f0] px-4 py-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-[#2454ff] focus-within:ring-2 focus-within:ring-[#2454ff]/15 transition-all">
              <Mail className="w-4 h-4 text-[#94a3b8] mr-3 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@yourmail.com"
                className="w-full text-[13px] text-[#0f172a] placeholder-[#94a3b8] bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1e293b] mb-2">
              Password
            </label>
            <div className="flex items-center w-full bg-white rounded-2xl border border-[#e2e8f0] px-4 py-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] focus-within:border-[#2454ff] focus-within:ring-2 focus-within:ring-[#2454ff]/15 transition-all">
              <Lock className="w-4 h-4 text-[#94a3b8] mr-3 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-[13px] text-[#0f172a] placeholder-[#94a3b8] bg-transparent outline-none tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#94a3b8] hover:text-[#64748b] transition-colors ml-2"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded-md border-[#cbd5e1] text-[#2454ff] focus:ring-0 cursor-pointer"
              />
              <span className="text-[12px] font-medium text-[#64748b]">
                Remember Me
              </span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => e.preventDefault()}
              className="text-[12px] font-medium text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#2454ff] hover:bg-[#1a44e5] text-white font-semibold text-[15px] shadow-[0_12px_24px_rgba(36,84,255,0.32)] active:scale-[0.99] transition-all mt-6 cursor-pointer"
          >
            {signedIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Or Divider */}
        <div className="w-full flex items-center justify-center my-6">
          <div className="h-[1px] bg-[#e2e8f0] flex-1" />
          <span className="px-4 text-[12px] text-[#94a3b8] font-normal">Or</span>
          <div className="h-[1px] bg-[#e2e8f0] flex-1" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Apple */}
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Sign in with Apple"
          >
            <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 0.6-2.65 1.36-.58.67-1.09 1.74-.95 2.77.99.08 2.05-.53 2.67-1.28z" />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Sign in with Facebook"
          >
            <svg className="w-5 h-5 fill-[#1877f2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Google */}
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center pt-6">
        <p className="text-[13px] text-[#64748b]">
          Don&apos;t have any Account?{' '}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('scan')}
            className="font-bold text-[#2454ff] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
