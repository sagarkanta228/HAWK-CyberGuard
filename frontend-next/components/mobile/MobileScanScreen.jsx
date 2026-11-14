'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Home,
  Heart,
  LayoutGrid,
  Settings,
  Smile,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function MobileScanScreen({ onNavigate }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(20);
  const [itemsScanned, setItemsScanned] = useState(155);
  const [threatsFound, setThreatsFound] = useState(0);
  const [lastScanTime, setLastScanTime] = useState('1 minute ago');

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progress > 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        setItemsScanned(155);
        setThreatsFound(0);
        setLastScanTime('Just now');
      } else {
        setScanProgress(progress);
        setItemsScanned(Math.floor((progress / 100) * 155));
      }
    }, 45);
  };

  // Numbers arranged around the circular gauge
  // 50 is at top (270 deg), 100 is at bottom (90 deg)
  const dialNumbers = [
    { num: 50, x: 50, y: 10 },
    { num: 60, x: 74, y: 18 },
    { num: 70, x: 90, y: 36 },
    { num: 80, x: 92, y: 64 },
    { num: 90, x: 76, y: 84 },
    { num: 100, x: 50, y: 92 },
    { num: 10, x: 24, y: 84 },
    { num: 20, x: 8, y: 64 },
    { num: 30, x: 10, y: 36 },
    { num: 40, x: 26, y: 18 },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-[#f7f9fc] flex flex-col justify-between pb-28 select-none">
      {/* Scrollable Content Container */}
      <div className="px-5 pt-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight">
            Security Scan
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

        {/* Circular Radial Gauge */}
        <div className="relative flex items-center justify-center py-5">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            {/* SVG Track & Arcs */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 280 280"
            >
              {/* Background circular track */}
              <circle
                cx="140"
                cy="140"
                r="105"
                fill="none"
                stroke="#e5ecf6"
                strokeWidth="12"
              />

              {/* Active Blue Arc (sweeps dynamically based on scanProgress) */}
              <circle
                cx="140"
                cy="140"
                r="105"
                fill="none"
                stroke="#2454ff"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="660"
                strokeDashoffset={660 - (660 * (isScanning ? scanProgress : 65)) / 100}
                className="transition-all duration-300 drop-shadow-[0_4px_12px_rgba(36,84,255,0.4)]"
              />
            </svg>

            {/* Dial Numbers positioned radially */}
            <div className="absolute inset-0 pointer-events-none">
              {dialNumbers.map((item) => (
                <span
                  key={item.num}
                  className="absolute text-[11px] font-medium text-[#94a3b8] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  {item.num}
                </span>
              ))}
            </div>

            {/* Blue Knob Indicator at position 20 */}
            <div
              className="absolute left-[7.5%] top-[64%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#2454ff] border-4 border-white shadow-[0_4px_12px_rgba(36,84,255,0.45)] pointer-events-none transition-transform duration-300"
              style={{
                transform: isScanning
                  ? `rotate(${(scanProgress / 100) * 360}deg) translate(0, -105px)`
                  : 'none',
              }}
            />

            {/* Center Circular Action Button */}
            <button
              type="button"
              onClick={startScan}
              className={`relative z-10 w-[152px] h-[152px] rounded-full bg-white shadow-[0_16px_36px_rgba(36,84,255,0.12)] border border-[#eef2f7] flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 group hover:shadow-[0_20px_42px_rgba(36,84,255,0.18)] ${
                isScanning ? 'scale-95 ring-4 ring-[#2454ff]/20' : ''
              }`}
            >
              {/* Scan Viewfinder Icon with Smiley */}
              <div className="relative w-12 h-12 flex items-center justify-center text-[#2454ff]">
                {/* 4 Corner Viewfinder Brackets */}
                <svg
                  viewBox="0 0 44 44"
                  fill="none"
                  className={`w-11 h-11 stroke-[#2454ff] stroke-[2.8] stroke-linecap-round ${
                    isScanning ? 'animate-spin' : ''
                  }`}
                >
                  {/* Top Left */}
                  <path d="M4 14V6C4 4.89543 4.89543 4 6 4H14" />
                  {/* Top Right */}
                  <path d="M30 4H38C39.1046 4 40 4.89543 40 6V14" />
                  {/* Bottom Right */}
                  <path d="M40 30V38C40 39.1046 39.1046 40 38 40H30" />
                  {/* Bottom Left */}
                  <path d="M14 40H6C4.89543 40 4 39.1046 4 38V30" />
                </svg>

                {/* Smiley Face In Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-[#2454ff] stroke-[2.4]" />
                </div>
              </div>

              {/* Label */}
              <span className="text-[12px] font-semibold text-[#1e293b] mt-2 tracking-tight">
                {isScanning ? `${scanProgress}%` : 'Tap to Scan'}
              </span>
            </button>
          </div>
        </div>

        {/* Card: Last Scan */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#eef2f7] mt-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#0f172a]">Last Scan</h2>
            <span className="bg-[#f1f5f9] text-[#64748b] text-[11px] font-medium px-2.5 py-1 rounded-full">
              {lastScanTime}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="text-[32px] font-extrabold text-[#0f172a] leading-none">
                {itemsScanned}
              </div>
              <div className="text-[12px] text-[#94a3b8] mt-1 font-normal">
                Items Scanned
              </div>
            </div>
            <div>
              <div className="text-[32px] font-extrabold text-[#0f172a] leading-none">
                {threatsFound}
              </div>
              <div className="text-[12px] text-[#94a3b8] mt-1 font-normal">
                Threats Found
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-[#eff6ff] rounded-2xl p-3.5 flex items-center gap-3 mt-4 border border-[#dbeafe]">
            <div className="w-5 h-5 rounded-full bg-[#2454ff] text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[12px] font-semibold text-[#1e293b]">
              All clear! No threats detected
            </span>
          </div>
        </div>

        {/* Section: Recent Scans */}
        <div className="mt-5">
          <h2 className="text-[14px] font-bold text-[#0f172a] mb-3">
            Recent Scans
          </h2>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#eef2f7] flex items-center justify-between hover:border-[#dbeafe] transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center border border-[#d1fae5] shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#0f172a]">
                    155 items scanned
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-0.5">
                    Today, 10:14 AM
                  </div>
                </div>
              </div>
              <span className="bg-[#ecfdf5] text-[#059669] text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#d1fae5]">
                Clean
              </span>
            </div>

            {/* Item 2 */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#eef2f7] flex items-center justify-between hover:border-[#ffe4e6] transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#fff1f2] text-[#f43f5e] flex items-center justify-center border border-[#ffe4e6] shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#0f172a]">
                    163 items scanned
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-0.5">
                    Yesterday, 4:20 PM
                  </div>
                </div>
              </div>
              <span className="bg-[#fff1f2] text-[#e11d48] text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#ffe4e6]">
                2 Threats Neutralized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-5 left-5 right-5 max-w-sm mx-auto z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.09)] py-2.5 px-6 flex justify-between items-center border border-[#eef2f7]">
          {/* Home */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('login')}
            className="p-2 text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Heart */}
          <button
            type="button"
            className="p-2 text-[#94a3b8] hover:text-[#2454ff] transition-colors"
            aria-label="Favorites"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Scan Button (Active) */}
          <button
            type="button"
            onClick={startScan}
            className="bg-[#eff6ff] text-[#2454ff] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[12px] font-semibold border border-[#dbeafe] shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Scan</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('alerts')}
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
