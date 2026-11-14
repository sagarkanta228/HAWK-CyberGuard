'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, RefreshCw, X, Zap } from 'lucide-react';
import { EASE_OUT_EXPO } from './motion/MotionPrimitives';

export default function DemoModal({
  isOpen,
  onClose,
  setActiveView,
  onEnterConsole,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  const steps = [
    {
      title: 'Step 1: Spearphishing Delivery via Look-Alike Domain',
      engine: 'PhishX (LightGBM + CharCNN)',
      detail:
        'Adversary sends urgent email from operator@sovereign-vault-login.internal with credential harvesting link.',
      targetView: 'phishx',
    },
    {
      title: 'Step 2: Polymorphic Dropper Ingestion in Invoice ZIP',
      engine: 'EMBER2024 (14 LightGBM Boosters)',
      detail:
        'Victim downloads invoice_2026.pdf.exe. EMBER2024 identifies UPX packed sections and 7.45 Shannon entropy.',
      targetView: 'ember',
    },
    {
      title: 'Step 3: Executive Synthetic Media Impersonation',
      engine: 'DeepGuard (MS-EffGCViT Vision)',
      detail:
        'Adversary attempts emergency CEO video call requesting $250,000 wire. DeepGuard flags facial blend seams.',
      targetView: 'deepguard',
    },
    {
      title: 'Step 4: Automated SecOps Containment & Incident Triage',
      engine: 'HAWK Autonomous SOC',
      detail:
        'Quarantined phishing email, blocked C2 domain at firewall, and isolated compromised endpoint.',
      targetView: 'incidents',
    },
  ];

  const navigateTarget = (view) => {
    if (onEnterConsole) {
      onEnterConsole(view);
    } else if (setActiveView) {
      setActiveView(view);
    }
  };

  const runStep = (stepIdx) => {
    setCurrentStep(stepIdx);
    const s = steps[stepIdx];
    if (s.targetView) {
      navigateTarget(s.targetView);
      onClose();
    }
  };

  const startAutomatedTour = async () => {
    setRunning(true);
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      navigateTarget(steps[i].targetView);
      await new Promise((r) => setTimeout(r, 1500));
    }
    setRunning(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
            className="w-full max-w-2xl rounded-2xl glass-panel p-6 lg:p-8 space-y-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[4px] bg-white/[0.06] border border-white/15 text-slate-200 text-[10px] font-mono uppercase tracking-[0.16em]">
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive Multi-Vector Attack Simulator</span>
              </div>
              <h2 className="font-display text-xl lg:text-2xl font-semibold uppercase tracking-wide text-white">
                HAWK End-to-End Threat Defense Tour
              </h2>
              <p className="text-xs text-slate-400">
                Select any kill-chain vector to jump straight into its live AI
                inspection route.
              </p>
            </div>

            <div className="space-y-2.5">
              {steps.map((st, idx) => (
                <button
                  key={st.targetView}
                  type="button"
                  onClick={() => runStep(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${currentStep === idx
                      ? 'bg-white/[0.08] border-white/30'
                      : 'bg-[#0d0f13]/90 border-white/[0.08] hover:border-white/25'
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold font-mono text-white">
                        {st.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-white/[0.06] text-slate-300 border border-white/10">
                        {st.engine}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{st.detail}</p>
                  </div>

                  <div className="shrink-0 pl-2">
                    <span className="text-[11px] font-mono text-slate-200 flex items-center gap-1">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={startAutomatedTour}
                disabled={running}
                className="px-5 py-2.5 rounded-[4px] bg-[#0d1016] hover:bg-black border border-white/25 text-white font-display uppercase tracking-[0.14em] text-[11px] flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {running ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Tour...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Automated Tour</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[4px] bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-mono text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
