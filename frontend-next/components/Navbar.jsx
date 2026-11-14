'use client';

import React from 'react';
import Link from 'next/link';
import { HawkGeometricMark } from './HawkMark';

export default function Navbar({
  activeView = 'main',
  operatorUser,
  onLogout,
  variant = 'console',
}) {
  const isLanding = variant === 'landing';

  const navItems = [
    { id: 'main', href: '/main-dashboard', label: 'Command Center' },
    { id: 'mobile', href: '/mobile', label: 'Mobile App (.APK)' },
    ...(isLanding
      ? [
          { id: 'phishx', href: '/console/phishx', label: 'PhishX' },
          { id: 'ember', href: '/console/ember', label: 'EMBER2024' },
          { id: 'deepguard', href: '/console/deepguard', label: 'DeepGuard' },
          { id: 'incidents', href: '/console/incidents', label: 'Incidents' },
          { id: 'threat-intel', href: '/console/threat-intel', label: 'Intelligence' },
        ]
      : [
          { id: 'command-center', href: '/console', label: 'Console' },
          { id: 'phishx', href: '/console/phishx', label: 'PhishX' },
          { id: 'ember', href: '/console/ember', label: 'EMBER2024' },
          { id: 'deepguard', href: '/console/deepguard', label: 'DeepGuard' },
          { id: 'incidents', href: '/console/incidents', label: 'Incidents' },
          { id: 'threat-intel', href: '/console/threat-intel', label: 'Intelligence' },
          { id: 'audit-logs', href: '/console/audit-logs', label: 'Audit trail' },
        ]),
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[#e5e9f2] px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: HAWK Logo */}
        <Link href="/main-dashboard" className="flex items-center gap-2.5 shrink-0">
          <HawkGeometricMark className="w-8 h-8" />
          <span className="font-display font-bold text-base tracking-tight text-[#0f172a]">
            HAWK
          </span>
        </Link>

        {/* Center Navigation Links matching Page 1 & Page 5 */}
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? 'text-[#2454ff] font-semibold'
                    : 'text-[#475569] hover:text-[#0f172a]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {!isLanding && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eafaf1] border border-[#bbf7d0] text-[#15803d] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              <span>3 engines active</span>
            </div>
          )}

          {operatorUser ? (
            <button
              type="button"
              onClick={onLogout}
              className="text-[13px] font-medium text-[#475569] hover:text-[#0f172a] transition-colors px-2 py-1"
            >
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-3 text-[13px] font-medium">
              <Link
                href="/login"
                className="text-[#475569] hover:text-[#0f172a] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline text-[#475569] hover:text-[#0f172a] transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

          <Link
            href="/console"
            className="px-4 py-2 rounded-lg bg-[#2454ff] hover:bg-[#1a44e5] text-white text-[13px] font-semibold shadow-sm transition-colors"
          >
            Open console
          </Link>
        </div>
      </div>
    </header>
  );
}
