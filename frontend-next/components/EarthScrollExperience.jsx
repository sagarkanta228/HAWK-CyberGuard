'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Globe, Radio, ShieldCheck, Zap } from 'lucide-react';
import RealEarth3D from './RealEarth3D';
import CommandCenter from './CommandCenter';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EarthScrollExperience() {
  const pinWrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroTextRef = useRef(null);
  const handContainerRef = useRef(null);
  const handSvgRef = useRef(null);
  const earthMountRef = useRef(null);
  const scrollCueRef = useRef(null);
  const hudOverlayRef = useRef(null);
  const flashOverlayRef = useRef(null);

  // Live scroll progress reference passed directly into Three.js 60fps render loop
  const scrollRef = useRef({ progress: 0 });

  const [hudPhase, setHudPhase] = useState(0); // 0: none, 1: orbital, 2: atmosphere, 3: grid

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    if (typeof window === 'undefined' || !pinWrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate delta to move Earth from hand cradle directly to screen center
      const computeCenterDelta = () => {
        if (!earthMountRef.current) return { deltaX: -240, deltaY: 0 };
        const rect = earthMountRef.current.getBoundingClientRect();
        const currentCenterX = rect.left + rect.width / 2;
        const currentCenterY = rect.top + rect.height / 2;
        const targetCenterX = window.innerWidth / 2;
        const targetCenterY = window.innerHeight / 2;
        return {
          deltaX: targetCenterX - currentCenterX,
          deltaY: targetCenterY - currentCenterY,
        };
      };

      const { deltaX, deltaY } = computeCenterDelta();

      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapperRef.current,
          start: 'top top',
          end: '+=2400', // Smooth scroll runway
          pin: stickyRef.current,
          scrub: 0.85,
          onUpdate: (self) => {
            const p = self.progress;
            scrollRef.current.progress = p;

            // Telemetry HUD milestones during the deep dive
            if (p < 0.2) {
              setHudPhase(0);
            } else if (p < 0.48) {
              setHudPhase(1); // 360° Continental Reconnaissance
            } else if (p < 0.78) {
              setHudPhase(2); // Inner Cyber Mesh Holograph
            } else if (p < 0.86) {
              setHudPhase(3); // Core Penetration
            } else {
              setHudPhase(0); // Cleanly cleared before transition ends
            }
          },
        },
      });

      // 0.0 -> 0.22: Hero text & hand fade out as Earth lifts and glides to center
      pinTimeline.to(
        heroTextRef.current,
        {
          opacity: 0,
          y: -40,
          duration: 0.2,
          ease: 'power2.out',
        },
        0
      );

      pinTimeline.to(
        handSvgRef.current,
        {
          opacity: 0,
          y: 55,
          scale: 0.9,
          duration: 0.2,
          ease: 'power2.in',
        },
        0
      );

      pinTimeline.to(
        scrollCueRef.current,
        {
          opacity: 0,
          duration: 0.15,
        },
        0
      );

      pinTimeline.to(
        heroCardRef.current,
        {
          borderColor: 'transparent',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          duration: 0.22,
        },
        0
      );

      // Earth moves to center and begins initial enlargement (1x -> 2.2x)
      pinTimeline.to(
        earthMountRef.current,
        {
          x: deltaX,
          y: deltaY,
          scale: 2.2,
          duration: 0.22,
          ease: 'power2.inOut',
        },
        0
      );

      // 0.22 -> 0.82: Massive Deep Dive Expansion (2.2x -> 38x across entire viewport)
      pinTimeline.to(
        earthMountRef.current,
        {
          scale: 38,
          duration: 0.6,
          ease: 'power2.in',
        },
        0.22
      );

      // 0.78 -> 0.88: Light bloom / cyber portal transition
      pinTimeline.fromTo(
        flashOverlayRef.current,
        { opacity: 0 },
        {
          opacity: 0.96,
          duration: 0.1,
          ease: 'power1.in',
        },
        0.78
      );

      // 0.86 -> 0.96: Earth fades out, flash clears smoothly
      pinTimeline.to(
        earthMountRef.current,
        {
          opacity: 0,
          duration: 0.08,
        },
        0.84
      );

      pinTimeline.to(
        flashOverlayRef.current,
        {
          opacity: 0,
          duration: 0.12,
          ease: 'power2.out',
        },
        0.88
      );
    }, pinWrapperRef);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollToDashboard = () => {
    const el = document.getElementById('live-dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={pinWrapperRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden bg-[#f5f7fc] flex flex-col justify-between"
      >
        {/* Ambient Darkening Vignette during dive to guarantee 100% text readability */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/45 via-transparent to-black/35 transition-opacity duration-500 ${
            hudPhase > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Cyber Light Bloom / Portal Out Overlay on z-35 */}
        <div
          ref={flashOverlayRef}
          className="pointer-events-none absolute inset-0 z-35 bg-gradient-to-b from-white via-[#eef2ff] to-[#f5f7fc] opacity-0"
        />

        {/* High-Contrast Cyber Telemetry HUD Overlay on z-30 */}
        <div
          ref={hudOverlayRef}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none"
        >
          {hudPhase === 1 && (
            <div className="bg-[#0b1120]/92 backdrop-blur-xl border border-white/20 p-6 sm:p-7 rounded-2xl shadow-2xl max-w-lg mx-auto text-center space-y-3 ring-1 ring-white/10 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2454ff] text-white text-xs font-mono font-bold tracking-wider shadow-md shadow-[#2454ff]/40">
                <Globe className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>360° CONTINENTAL RECONNAISSANCE · ALT 420 KM</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Scanning Global Threat Vectors
              </h2>
              <p className="text-xs sm:text-sm text-[#93c5fd] font-mono leading-relaxed">
                Sweeping Americas, Europe, Africa, India, East Asia & Oceania in real-time.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-mono text-[#94a3b8] border-t border-white/10">
                <span>● 7 CONTINENTS TRACKED</span>
                <span>•</span>
                <span>ORBIT: 360°</span>
                <span>•</span>
                <span>ZOOM: 2.2X</span>
              </div>
            </div>
          )}

          {hudPhase === 2 && (
            <div className="bg-[#0b1120]/92 backdrop-blur-xl border border-white/20 p-6 sm:p-7 rounded-2xl shadow-2xl max-w-lg mx-auto text-center space-y-3 ring-1 ring-white/10 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7c3aed] text-white text-xs font-mono font-bold tracking-wider shadow-md shadow-[#7c3aed]/40">
                <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>ATMOSPHERIC ENTRY · INNER CYBER MESH HOLOGRAPH</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Global Sovereign Defense Matrix
              </h2>
              <p className="text-xs sm:text-sm text-[#c4b5fd] font-mono leading-relaxed">
                All continents interconnected with sovereign neural defense arcs & sensor hubs.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-mono text-[#94a3b8] border-t border-white/10">
                <span>● 10 DEFENSE HUBS ONLINE</span>
                <span>•</span>
                <span>LATENCY: 14ms</span>
                <span>•</span>
                <span>ZOOM: 16.0X</span>
              </div>
            </div>
          )}

          {hudPhase === 3 && (
            <div className="bg-[#0b1120]/92 backdrop-blur-xl border border-white/20 p-6 sm:p-7 rounded-2xl shadow-2xl max-w-lg mx-auto text-center space-y-3 ring-1 ring-white/10 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16a34a] text-white text-xs font-mono font-bold tracking-wider shadow-md shadow-[#16a34a]/40">
                <ShieldCheck className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>NEURAL GRID PENETRATION · ELEVATION 0 KM</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                Entering Autonomous Command Center
              </h2>
              <p className="text-xs sm:text-sm text-[#86efac] font-mono leading-relaxed">
                Decrypting live incident queue and security telemetry...
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-mono text-[#94a3b8] border-t border-white/10">
                <span>● DEFENSE MATRIX READY</span>
                <span>•</span>
                <span>GRID: 99.98%</span>
                <span>•</span>
                <span>REVEALING DASHBOARD</span>
              </div>
            </div>
          )}
        </div>

        {/* Page 1 Hero Card */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
          <div
            ref={heroCardRef}
            className="w-full max-w-[1220px] mx-auto bg-white rounded-3xl border border-[#e5e9f2] shadow-sm px-6 sm:px-12 lg:px-16 pt-10 pb-8 transition-colors duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 min-h-[360px]">
              {/* Left Copy */}
              <div ref={heroTextRef} className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eafaf1] text-[#15803d] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                  <span>All sectors nominal</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.06] tracking-tight text-[#0f172a]">
                  Secure everything you click, open and trust.
                </h1>

                <p className="text-sm sm:text-base text-[#64748b] leading-relaxed max-w-md">
                  HAWK brings phishing, malware and deepfake detection into one
                  command center, so your security team acts on a single,
                  real-time view.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href="/console"
                    className="px-6 py-3 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white text-sm font-semibold shadow-sm transition-colors"
                  >
                    Open console
                  </Link>
                  <Link
                    href="/console/phishx"
                    className="px-6 py-3 rounded-xl bg-white hover:bg-[#f8fafc] border border-[#dce2ee] text-[#0f172a] text-sm font-semibold transition-colors"
                  >
                    Scan a URL
                  </Link>
                </div>
              </div>

              {/* Right: Anatomical Cradling Hand with Real 3D Earth Nestled Inside */}
              <div className="lg:col-span-6 flex justify-center relative min-h-[340px]">
                <div
                  ref={handContainerRef}
                  className="relative select-none w-full max-w-[340px] sm:max-w-[390px] aspect-[380/340]"
                >
                  {/* Glowing orbital aura matching Image 1 */}
                  <div className="absolute left-1/2 top-[41.2%] -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] rounded-full bg-gradient-to-tr from-[#3b82f6]/25 via-[#93c5fd]/20 to-transparent blur-2xl pointer-events-none" />

                  {/* Decorative Sparkles & Orbit Arc SVG */}
                  <svg
                    viewBox="0 0 380 340"
                    fill="none"
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M64 134C48 182 54 222 86 248"
                      stroke="#f4a6b8"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <path
                      d="M90 64L93.5 73L102.5 76.5L93.5 80L90 89L86.5 80L77.5 76.5L86.5 73Z"
                      stroke="#2454ff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M312 46L315.5 55L324.5 58.5L315.5 62L312 71L308.5 62L299.5 58.5L308.5 55Z"
                      stroke="#2454ff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M78 186L80.5 192.5L87 195L80.5 197.5L78 204L75.5 197.5L69 195L75.5 192.5Z"
                      stroke="#f4a6b8"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* THE REAL 3D EARTH MOUNTED RIGHT INSIDE THE HAND CRADLE! */}
                  <div
                    ref={earthMountRef}
                    className="absolute left-1/2 top-[41.2%] -translate-x-1/2 -translate-y-1/2 w-[56%] aspect-square z-10 flex items-center justify-center pointer-events-auto will-change-transform"
                  >
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative">
                      <RealEarth3D
                        interactive
                        cameraDistance={2.42}
                        autoRotateSpeed={0.22}
                        scrollRef={scrollRef}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Anatomical Cradling Hand on z-20 (Fingers & Palm curl in front of the lower-left Earth) */}
                  <svg
                    ref={handSvgRef}
                    viewBox="0 0 380 340"
                    fill="none"
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                    aria-hidden="true"
                  >
                    {/* Palm & wrist body */}
                    <path
                      d="M99 192C95 232 122 276 184 276C222 276 248 263 274 256L280 288C248 294 218 297 182 296C116 294 82 252 86 202C87 193 93 188 99 192Z"
                      fill="#ffffff"
                      stroke="#2454ff"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                    />

                    {/* Left fingers cupping globe */}
                    <path
                      d="M140 198C136 184 143 172 153 174C161 176 167 191 171 210"
                      fill="#ffffff"
                      stroke="#2454ff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M119 194C113 177 121 163 132 165C141 167 147 186 152 212"
                      fill="#ffffff"
                      stroke="#2454ff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M100 192C94 176 102 161 113 163C122 165 128 186 134 214"
                      fill="#ffffff"
                      stroke="#2454ff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Thumb wrapping lower-right */}
                    <path
                      d="M210 245C226 232 237 212 246 196C252 186 264 185 268 195C272 206 263 224 248 240C241 247 234 252 228 256"
                      fill="#ffffff"
                      stroke="#2454ff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Palm crease */}
                    <path
                      d="M148 242C168 248 194 246 212 236"
                      stroke="#2454ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Royal blue cuff */}
                    <g transform="rotate(-8 274 270)">
                      <rect
                        x="270"
                        y="236"
                        width="38"
                        height="66"
                        rx="10"
                        fill="#2454ff"
                      />
                      <line
                        x1="278"
                        y1="246"
                        x2="278"
                        y2="292"
                        stroke="#93c5fd"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Scroll Cue Button */}
            <div ref={scrollCueRef} className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={scrollToDashboard}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4f6fb] hover:bg-[#eaedf7] text-[#475569] text-xs font-medium transition-colors"
              >
                <span>Scroll to dive into the defense grid</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page 2: Live Command Overview - Placed cleanly below the pinned dive sequence */}
      <section
        id="live-dashboard"
        className="relative z-30 px-4 sm:px-8 py-14 bg-[#f5f7fc] -mt-2"
      >
        <div className="max-w-[1220px] mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5e9f2]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eafaf1] text-[#15803d] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                <span>Defense Grid Online</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-2">
                SecOps Threat Command & AI Orchestration
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Real-time multi-vector threat prevention powered by PhishX, EMBER2024, and DeepGuard.
              </p>
            </div>

            <Link
              href="/console"
              className="self-start sm:self-center px-5 py-2.5 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Open full console →
            </Link>
          </div>

          <CommandCenter embedded />
        </div>
      </section>
    </div>
  );
}
