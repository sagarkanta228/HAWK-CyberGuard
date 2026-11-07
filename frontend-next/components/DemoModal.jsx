'use client';

import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  X,
  Shield,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Fish,
  FileCode,
  ScanFace,
  Zap
} from 'lucide-react';

export default function DemoModal({
  isOpen,
  onClose,
  setActiveView,
  setCurrentRole,
  setSelectedIncidentId
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Spearphishing Delivery via Look-Alike Domain',
      engine: 'PhishX (LightGBM + CharCNN)',
      detail: 'Adversary sends urgent email from operator@sovereign-vault-login.internal with credential harvesting link.',
      targetView: 'phishx'
    },
    {
      title: 'Step 2: Polymorphic Dropper Ingestion in Invoice ZIP',
      engine: 'EMBER2024 (14 LightGBM Boosters)',
      detail: 'Victim downloads invoice_2026.pdf.exe. EMBER2024 identifies UPX packed sections and 7.45 Shannon entropy.',
      targetView: 'ember'
    },
    {
      title: 'Step 3: Executive Synthetic Media Impersonation',
      engine: 'DeepGuard (MS-EffGCViT Vision)',
      detail: 'Adversary attempts emergency CEO video call requesting $250,000 wire. DeepGuard flags facial blend seams.',
      targetView: 'deepguard'
    },
    {
      title: 'Step 4: Automated SecOps Containment & Incident Triage',
      engine: 'HAWK Autonomous SOC',
      detail: 'Quarantined phishing email, blocked C2 domain at firewall, and isolated compromised endpoint.',
      targetView: 'incidents'
    }
  ];

  const runStep = (stepIdx) => {
    setCurrentStep(stepIdx);
    const s = steps[stepIdx];
    if (s.targetView) {
      setActiveView(s.targetView);
    }
  };

  const startAutomatedTour = async () => {
    setRunning(true);
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setActiveView(steps[i].targetView);
      await new Promise(r => setTimeout(r, 2200));
    }
    setRunning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0f141e] border border-[#1e2638] p-6 lg:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Multi-Vector Attack Simulator</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">
            HAWK End-to-End Threat Defense Tour
          </h2>
          <p className="text-xs text-gray-400">
            Witness how PhishX, EMBER2024, and DeepGuard collaborate in real time to neutralize an advanced persistent threat.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((st, idx) => (
            <div
              key={idx}
              onClick={() => runStep(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                currentStep === idx
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                  : 'bg-[#080a0f] border-[#1a2233] hover:border-[#2a3650]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono text-cyan-400">
                    {st.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162033] text-gray-300">
                    {st.engine}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{st.detail}</p>
              </div>

              <div className="shrink-0 pl-3">
                {currentStep === idx ? (
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center space-x-1">
                    <span>ACTIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs font-mono text-gray-600">Select</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1e2638]">
          <button
            onClick={startAutomatedTour}
            disabled={running}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs font-mono flex items-center space-x-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Multi-Vector Attack...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Automated Live Tour (All 3 Models)</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

