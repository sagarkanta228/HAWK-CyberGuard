'use client';

import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function MobileDeviceShell({
  children,
  currentScreen = 'scan',
  onScreenChange,
  showFrame = true,
}) {
  if (!showFrame) {
    return <div className="w-full h-full min-h-screen">{children}</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[820px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_rgba(15,23,42,0.25)] border-4 border-[#1e293b] ring-1 ring-white/20 select-none flex flex-col">
      {/* Smartphone Outer Bezel & Dynamic Island */}
      <div className="relative w-full h-full bg-[#f8fafc] rounded-[40px] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="relative z-50 w-full px-7 pt-3.5 pb-2 flex items-center justify-between text-[#0f172a] text-[12px] font-semibold">
          <span>9:41</span>

          {/* Dynamic Island / Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-5 bg-black rounded-full flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-black" />
          </div>

          <div className="flex items-center gap-1.5 text-[#0f172a]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {children}
        </div>

        {/* Home Swipe Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#0f172a]/80 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
