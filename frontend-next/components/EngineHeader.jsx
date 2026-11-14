'use client';

import React from 'react';
import Link from 'next/link';

export default function EngineHeader({
  vectorLabel,
  title,
  description,
  activeEngine,
}) {
  const engines = [
    { id: 'phishx', href: '/console/phishx', label: 'PhishX' },
    { id: 'ember', href: '/console/ember', label: 'EMBER2024' },
    { id: 'deepguard', href: '/console/deepguard', label: 'DeepGuard' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#e5e9f2] shadow-sm p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-[#2454ff]">
          {vectorLabel}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] max-w-2xl">
          {description}
        </p>
      </div>

      {/* Right Engine Pill Switcher matching Page 5 */}
      <div className="inline-flex items-center p-1 rounded-full bg-[#f1f4fb] border border-[#e5e9f2] self-start lg:self-center shrink-0">
        {engines.map((eng) => {
          const isActive = activeEngine === eng.id;
          return (
            <Link
              key={eng.id}
              href={eng.href}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#2454ff] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              {eng.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

