'use client';

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { EASE_OUT_EXPO } from './motion/MotionPrimitives';

/**
 * Single 3D Cube rendered in CSS preserve-3d with directional studio shading.
 * finish: 'obsidian' | 'silver' | 'glass'
 */
function IsoCube({ x, y, z, size = 44, finish = 'obsidian', spread = 1 }) {
  const half = size / 2;

  const palettes = {
    obsidian: {
      top: 'linear-gradient(135deg, #272c38 0%, #11141b 100%)',
      front: 'linear-gradient(180deg, #131720 0%, #07090d 100%)',
      right: 'linear-gradient(180deg, #191e29 0%, #090c11 100%)',
      left: '#06080b',
      back: '#050608',
      bottom: '#040507',
      border: '1px solid rgba(255,255,255,0.11)',
    },
    silver: {
      top: 'linear-gradient(135deg, #b8c2d1 0%, #7f8b9e 100%)',
      front: 'linear-gradient(180deg, #748094 0%, #4d5667 100%)',
      right: 'linear-gradient(180deg, #8f9bb0 0%, #5c6678 100%)',
      left: '#414957',
      back: '#3a414e',
      bottom: '#2b303a',
      border: '1px solid rgba(255,255,255,0.28)',
    },
    glass: {
      top: 'linear-gradient(135deg, rgba(186,199,219,0.28) 0%, rgba(110,124,148,0.14) 100%)',
      front: 'rgba(130, 145, 170, 0.14)',
      right: 'rgba(165, 180, 204, 0.22)',
      left: 'rgba(95, 108, 130, 0.12)',
      back: 'rgba(95, 108, 130, 0.10)',
      bottom: 'rgba(70, 80, 98, 0.15)',
      border: '1px solid rgba(226, 232, 240, 0.36)',
    },
  };

  const p = palettes[finish];
  const tx = x * size * spread;
  const ty = y * size * spread;
  const tz = z * size * spread;

  const faceStyle = (transform, background) => ({
    position: 'absolute',
    width: size,
    height: size,
    transform,
    background,
    border: p.border,
    backfaceVisibility: finish === 'glass' ? 'visible' : 'hidden',
    borderRadius: '3px',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        marginLeft: -half,
        marginTop: -half,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${tx}px, ${ty}px, ${tz}px)`,
        transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div style={faceStyle(`rotateY(0deg) translateZ(${half}px)`, p.front)} />
      <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`, p.back)} />
      <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`, p.right)} />
      <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`, p.left)} />
      <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`, p.top)} />
      <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`, p.bottom)} />
    </div>
  );
}

/**
 * Interactive 3D Isometric Modular Cube Cluster + Floating Code Cards
 * matching the ATLSCURE.TECH architectural hero centerpiece.
 */
export default function HeroCubeCluster({ mouseX, mouseY, scrollProgress }) {
  // Smooth spring-damped 3D tilt following cursor
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-18, -30]), {
    stiffness: 110,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-46, -26]), {
    stiffness: 110,
    damping: 22,
  });

  // Floating glass card counter-parallax
  const cardLeftX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), {
    stiffness: 90,
    damping: 20,
  });
  const cardLeftY = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 90,
    damping: 20,
  });
  const cardRightX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 90,
    damping: 20,
  });
  const cardRightY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), {
    stiffness: 90,
    damping: 20,
  });

  // Scroll-linked subtle separation of outer cluster
  const clusterScale = useTransform(scrollProgress, [0, 1], [1, 1.08]);
  const clusterRotateZ = useTransform(scrollProgress, [0, 1], [0, 8]);

  const cubes = [
    // Core 2x2x2 obsidian matrix
    { x: 0, y: 0, z: 0, finish: 'obsidian' },
    { x: 1, y: 0, z: 0, finish: 'obsidian' },
    { x: 0, y: 1, z: 0, finish: 'obsidian' },
    { x: 0, y: 0, z: 1, finish: 'obsidian' },
    { x: 1, y: 1, z: 0, finish: 'obsidian' },
    { x: 1, y: 0, z: 1, finish: 'obsidian' },
    { x: 0, y: 1, z: 1, finish: 'obsidian' },
    { x: -1, y: 0, z: 0, finish: 'obsidian' },
    { x: 0, y: -1, z: 0, finish: 'obsidian' },
    { x: 0, y: 0, z: -1, finish: 'obsidian' },
    // Extended brushed silver & glass satellite modules
    { x: 1.25, y: -0.95, z: 0.4, finish: 'silver' },
    { x: -1.15, y: 1.05, z: 0.9, finish: 'silver' },
    { x: -1.1, y: -0.8, z: -0.6, finish: 'glass' },
    { x: 1.15, y: 1.05, z: -0.8, finish: 'glass' },
    { x: 0.1, y: -1.25, z: 0.85, finish: 'obsidian' },
  ];

  return (
    <div className="relative w-full h-[430px] sm:h-[490px] flex items-center justify-center select-none">
      {/* Subtle Concentric Radial Rings behind cluster (like reference image) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[300px] h-[300px] rounded-full border border-white/[0.06]" />
        <div className="absolute w-[440px] h-[440px] rounded-full border border-white/[0.04]" />
        <div className="absolute w-[580px] h-[580px] rounded-full border border-white/[0.025]" />
      </div>

      {/* SVG Tether Lines connecting Floating Code Cards to Cluster */}
      <svg
        aria-hidden="true"
        viewBox="0 0 560 440"
        className="pointer-events-none absolute inset-0 w-full h-full z-10 opacity-50"
        fill="none"
      >
        <path
          d="M 118 116 C 175 112, 200 132, 232 162"
          stroke="rgba(226,232,240,0.45)"
          strokeWidth="1"
        />
        <circle cx="232" cy="162" r="2.5" fill="#e2e8f0" />
        <path
          d="M 412 315 C 378 308, 354 288, 326 262"
          stroke="rgba(226,232,240,0.45)"
          strokeWidth="1"
        />
        <circle cx="326" cy="262" r="2.5" fill="#e2e8f0" />
      </svg>

      {/* Orbiting Floating Geometric Accents (rings, cones, facets) */}
      <motion.div
        style={{ x: cardLeftX, y: cardRightY }}
        className="pointer-events-none absolute top-[11%] left-[37%] z-20"
      >
        <div className="w-7 h-4 rounded-full border-[4px] border-[#11151d] shadow-[0_6px_14px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.28)] -rotate-12" />
      </motion.div>

      <motion.div
        style={{ x: cardRightX, y: cardLeftY }}
        className="pointer-events-none absolute top-[18%] right-[12%] z-20"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-lg">
          <polygon
            points="12,2 22,9 18,21 6,21 2,9"
            fill="#141821"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      <motion.div
        style={{ x: cardLeftX, y: cardLeftY }}
        className="pointer-events-none absolute bottom-[27%] left-[21%] z-20"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-lg rotate-[28deg]">
          <polygon
            points="12,2 21,20 3,20"
            fill="#151922"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      <motion.div
        style={{ x: cardRightX, y: cardRightY }}
        className="pointer-events-none absolute top-[48%] right-[8%] z-20"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-lg -rotate-[24deg]">
          <polygon
            points="12,2 21,20 3,20"
            fill="#151922"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Main 3D Isometric Cube Assembly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        style={{
          perspective: 1100,
          scale: clusterScale,
          rotateZ: clusterRotateZ,
        }}
        className="relative z-10 w-[260px] h-[260px] flex items-center justify-center"
      >
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            rotateX: tiltX,
            rotateY: tiltY,
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {cubes.map((cube, i) => (
            <IsoCube
              key={i}
              x={cube.x}
              y={cube.y}
              z={cube.z}
              size={48}
              finish={cube.finish}
              spread={1.08}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Frosted Glass Code Card — Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -18, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.85, delay: 0.2, ease: EASE_OUT_EXPO }}
        style={{ x: cardLeftX, y: cardLeftY }}
        whileHover={{ scale: 1.04 }}
        className="hidden sm:block absolute top-[12%] left-[2%] lg:left-[0%] z-30 w-[198px] rounded-lg border border-white/25 bg-[#707d94]/25 backdrop-blur-md p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-default"
      >
        <pre className="font-mono text-[9.5px] leading-[1.45] text-slate-100/90 whitespace-pre">
          {`def notsecure(hawk):
  if hawk:
    security = True
  else:
    security = False
  return security`}
        </pre>
      </motion.div>

      {/* Floating Frosted Glass Code Card — Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 18, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.85, delay: 0.3, ease: EASE_OUT_EXPO }}
        style={{ x: cardRightX, y: cardRightY }}
        whileHover={{ scale: 1.04 }}
        className="hidden sm:block absolute bottom-[12%] right-[1%] lg:right-[0%] z-30 w-[198px] rounded-lg border border-white/25 bg-[#707d94]/25 backdrop-blur-md p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-default"
      >
        <pre className="font-mono text-[9.5px] leading-[1.45] text-slate-100/85 whitespace-pre">
          {`def ember_verify(bin):
  if score < 0.50:
    verdict = True
  else:
    verdict = False
  return verdict`}
        </pre>
      </motion.div>
    </div>
  );
}
