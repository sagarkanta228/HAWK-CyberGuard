'use client';

import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import RealEarth3D from './RealEarth3D';

/**
 * GlobeHandIllustration:
 * Renders the real 3D Earth (from earth.glb) nestled inside the clean anatomical
 * cradling hand with orbital sparkle accents.
 * Used in Page 1 (static/compact), Page 3 (/login), and Page 4 (/signup).
 */
export default function GlobeHandIllustration({
  scrollProgress,
  compact = false,
  className = '',
  interactive = true,
}) {
  const fallbackProgress = useMotionValue(0);
  const progress = scrollProgress || fallbackProgress;

  // Gentle lift motion if scroll progress is supplied
  const globeY = useTransform(progress, [0, 0.85], [0, -32]);
  const handY = useTransform(progress, [0, 0.85], [0, 18]);
  const handOpacity = useTransform(progress, [0, 0.9], [1, 0.6]);

  return (
    <div
      className={`relative select-none w-full ${
        compact ? 'max-w-[280px] sm:max-w-[310px]' : 'max-w-[340px] sm:max-w-[390px]'
      } aspect-[380/340] ${className}`}
    >
      {/* Background Orbital Accent Curve & 4-Point Sparkles */}
      <svg
        viewBox="0 0 380 340"
        fill="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
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

      {/* Real 3D Earth (from earth.glb) nestled in palm center (190, 140) */}
      <div className="absolute left-1/2 top-[41.2%] -translate-x-1/2 -translate-y-1/2 w-[56%] aspect-square z-10 flex items-center justify-center">
        <motion.div
          style={{ y: globeY }}
          className="w-full h-full rounded-full overflow-hidden shadow-xl"
        >
          <RealEarth3D
            interactive={interactive}
            cameraDistance={2.42}
            autoRotateSpeed={0.22}
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* Anatomical Cradling Hand (aligned to exact sphere center 190, 140, r=106) */}
      <motion.svg
        style={{ y: handY, opacity: handOpacity }}
        viewBox="0 0 380 340"
        fill="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-20"
        aria-hidden="true"
      >
        {/* Outer fingers cupping lower-left hemisphere */}
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

        {/* Fingertip crease accents */}
        <path
          d="M106 173C109 172 112 173 114 176"
          stroke="#93c5fd"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M126 175C129 174 132 175 134 178"
          stroke="#93c5fd"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Continuous cupped palm & wrist extending into sleeve cuff */}
        <path
          d="M99 192C95 232 122 276 184 276C222 276 248 263 274 256L280 288C248 294 218 297 182 296C116 294 82 252 86 202C87 193 93 188 99 192Z"
          fill="#ffffff"
          stroke="#2454ff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Thumb wrapping naturally over lower-right sphere boundary */}
        <path
          d="M210 245C226 232 237 212 246 196C252 186 264 185 268 195C272 206 263 224 248 240C241 247 234 252 228 256"
          fill="#ffffff"
          stroke="#2454ff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Soft inner palm crease */}
        <path
          d="M148 242C168 248 194 246 212 236"
          stroke="#2454ff"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Royal blue sleeve cuff */}
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
      </motion.svg>
    </div>
  );
}
