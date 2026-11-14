'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Interactive 3D Emerald Particle Cloud Canvas
 * - variant="hero": Rotating 3D neural hemisphere/sphere that responds smoothly
 *   to pointer proximity and disperses gracefully with scrollProgress (0..1).
 * - variant="dual-orb": Converging dual particle orbs for the bottom CTA section.
 * - Automatically pauses offscreen and respects prefers-reduced-motion.
 */
export default function ParticleMatrixCanvas({
  variant = 'hero',
  scrollProgress = 0,
  className = '',
}) {
  const canvasRef = useRef(null);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isVisible = true;

    const pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Build deterministic Fibonacci sphere + organic cyber-neural clusters
    const count = variant === 'hero' ? 950 : 620;
    const particles = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const y = 1 - 2 * t;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      // Subtle organic lobe deformation for neural/cyber brain feel
      const lobe =
        variant === 'hero'
          ? 0.88 +
            0.14 * Math.sin(theta * 3 + y * 4) +
            0.08 * Math.cos(theta * 5 - y * 3)
          : 0.92 + 0.08 * Math.sin(theta * 4 + y * 2);

      const x = Math.cos(theta) * radiusAtY * lobe;
      const z = Math.sin(theta) * radiusAtY * lobe;
      const oy = y * lobe * (variant === 'hero' ? 0.86 : 1);

      // Outer dispersion vector used on scroll
      const dirLen = Math.sqrt(x * x + oy * oy + z * z) || 1;
      particles.push({
        bx: x,
        by: oy,
        bz: z,
        dx: x / dirLen,
        dy: oy / dirLen,
        dz: z / dirLen,
        size: 1.0 + (i % 5) * 0.42,
        phase: (i * 0.37) % (Math.PI * 2),
        hueShift: i % 7 === 0 ? 1 : 0, // occasional lime highlight
        cluster: i % 2, // used by dual-orb
      });
    }

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    canvas.addEventListener('mouseleave', handlePointerLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;
    const render = () => {
      if (!isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (!prefersReducedMotion) {
        time += 0.0085;
      }

      ctx.clearRect(0, 0, width, height);

      const sp = Math.min(1, Math.max(0, scrollRef.current));
      const baseRadius =
        variant === 'hero'
          ? Math.min(width, height) * 0.34
          : Math.min(width, height) * 0.22;

      const rotY = time * 0.42 + sp * 1.1;
      const rotX = Math.sin(time * 0.35) * 0.18 + 0.16;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Center coordinates
      const cx = width * 0.5;
      const cy = variant === 'hero' ? height * 0.48 : height * 0.44;

      // Ambient volumetric emerald glow behind cloud
      const glowRadius = baseRadius * (1.35 + sp * 0.5);
      const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
      bgGlow.addColorStop(0, `rgba(34, 197, 94, ${0.2 * (1 - sp * 0.65)})`);
      bgGlow.addColorStop(0.5, `rgba(22, 163, 74, ${0.08 * (1 - sp * 0.65)})`);
      bgGlow.addColorStop(1, 'rgba(3, 7, 5, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Project & depth-sort
      const projected = [];
      const dispersion = variant === 'hero' ? sp * baseRadius * 2.1 : 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic breathing wave
        const wave = Math.sin(time * 1.4 + p.phase) * 0.045;
        let px = p.bx * (1 + wave);
        let py = p.by * (1 + wave);
        let pz = p.bz * (1 + wave);

        // Dual-orb horizontal convergence animation
        let orbOffsetX = 0;
        if (variant === 'dual-orb') {
          const swing = Math.sin(time * 0.85) * 0.45;
          orbOffsetX = (p.cluster === 0 ? -1 : 1) * (baseRadius * (0.48 + swing * 0.32));
        }

        // Rotate Y then X
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Scroll dispersion outward
        const worldX = x1 * baseRadius + p.dx * dispersion * 1.35 + orbOffsetX;
        const worldY = y2 * baseRadius + p.dy * dispersion * 0.9;
        const worldZ = z2 * baseRadius + p.dz * dispersion;

        const perspective = 680 / (680 + worldZ + baseRadius * 0.5);
        let sx = cx + worldX * perspective;
        let sy = cy + worldY * perspective;

        // Subtle pointer magnetic ripple
        let pointerBoost = 0;
        if (pointer.active) {
          const dx = sx - pointer.x;
          const dy = sy - pointer.y;
          const distSq = dx * dx + dy * dy;
          const influence = 140;
          if (distSq < influence * influence && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / influence) * 22;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
            pointerBoost = 1 - dist / influence;
          }
        }

        const depthAlpha = Math.max(0.12, Math.min(1, (z2 + 1.25) * 0.48));
        const scrollFade = variant === 'hero' ? Math.max(0.08, 1 - sp * 0.78) : 0.9;

        projected.push({
          sx,
          sy,
          z: worldZ,
          r: Math.max(0.65, p.size * perspective * (1 + pointerBoost * 0.7)),
          alpha: depthAlpha * scrollFade * (0.68 + pointerBoost * 0.32),
          lime: p.hueShift === 1 || pointerBoost > 0.45,
        });
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.r, 0, Math.PI * 2);
        if (pt.lime) {
          ctx.fillStyle = `rgba(163, 230, 53, ${pt.alpha})`;
        } else {
          ctx.fillStyle = `rgba(74, 222, 128, ${pt.alpha})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto w-full h-full block ${className}`}
      aria-hidden="true"
    />
  );
}

