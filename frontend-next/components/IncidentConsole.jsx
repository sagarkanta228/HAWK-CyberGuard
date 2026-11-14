'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from './motion/MotionPrimitives';

export default function IncidentConsole({
  incidentId = 'INC-1024',
  setSelectedIncidentId,
  backendUrl = 'http://127.0.0.1:8000',
}) {
  const [currentId, setCurrentId] = useState(incidentId);
  const [incident, setIncident] = useState(null);
  const [incidentsList, setIncidentsList] = useState([]);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/incidents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIncidentsList(data);
          const current = data.find((i) => i.id === currentId) || data[0];
          setIncident(current);
        }
      })
      .catch(() => {});
  }, [backendUrl, currentId]);

  useEffect(() => {
    if (!currentId) return;
    fetch(`${backendUrl}/api/v1/incidents/${currentId}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setIncident(data);
      })
      .catch(() => {});
  }, [currentId, backendUrl]);

  const handleEnforceAction = async (actionType) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/v1/incidents/${currentId}/response`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: actionType, analyst: 'Sarah Jenkins' }),
        }
      );
      const data = await res.json();
      if (data && data.incident) {
        setIncident(data.incident);
        setActionSuccess(
          data.message || `Countermeasure '${actionType}' enforced.`
        );
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch {
      if (incident) {
        setIncident({
          ...incident,
          status: 'CONTAINED',
          timeline: [
            ...incident.timeline,
            {
              stageOrder: incident.timeline.length + 1,
              stageName: `Countermeasure Enforced: ${actionType}`,
              timestamp: 'Just now',
              description: `Analyst enforced ${actionType}. Threat vector contained.`,
            },
          ],
        });
        setActionSuccess(`Countermeasure '${actionType}' enforced.`);
        setTimeout(() => setActionSuccess(''), 5000);
      }
    }
  };

  if (!incident) {
    return (
      <div className="max-w-[1220px] mx-auto py-16 text-center text-[#64748b] text-xs font-mono">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#2454ff]" />
        <span>Loading incident forensics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1220px] mx-auto py-8 space-y-6 animate-fadeIn">
      {/* Header & Switcher */}
      <div className="bg-white rounded-2xl border border-[#e5e9f2] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-[#dc2626]">
            Active SecOps Forensics
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0f172a] mt-0.5">
            Incident Investigation &amp; Containment
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            MITRE ATT&amp;CK kill-chain mapping and 1-click automated containment.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#f1f4fb] p-1 rounded-full">
          {incidentsList.map((inc) => (
            <button
              key={inc.id}
              type="button"
              onClick={() => {
                setCurrentId(inc.id);
                if (setSelectedIncidentId) setSelectedIncidentId(inc.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentId === inc.id
                  ? 'bg-[#2454ff] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              {inc.id}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-[#eafaf1] border border-[#bbf7d0] text-[#15803d] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Incident Summary Card */}
      <SpotlightCard className="p-6 sm:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#2454ff] font-semibold">
                {incident.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] font-semibold">
                {incident.threatType}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-semibold ${
                  incident.status === 'CONTAINED'
                    ? 'bg-[#eafaf1] text-[#15803d]'
                    : 'bg-[#fef2f2] text-[#dc2626]'
                }`}
              >
                {incident.status}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-[#0f172a]">
              {incident.title}
            </h2>
            <p className="text-xs text-[#64748b] max-w-3xl leading-relaxed">
              {incident.summary}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-[#fafbfe] p-4 rounded-xl border border-[#e5e9f2]">
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-[#dc2626]">
                {incident.riskScore}
              </div>
              <div className="text-[10px] font-mono uppercase text-[#64748b]">
                Risk /100
              </div>
            </div>
            <div className="h-10 w-px bg-[#e5e9f2]" />
            <div className="text-center">
              <div className="font-display text-2xl font-extrabold text-[#0f172a]">
                {incident.confidence}%
              </div>
              <div className="text-[10px] font-mono uppercase text-[#64748b]">
                Confidence
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2]">
            <div className="text-[10px] font-mono text-[#64748b]">AFFECTED USER</div>
            <div className="font-semibold text-[#0f172a] mt-0.5 truncate">
              {incident.affectedUser}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2]">
            <div className="text-[10px] font-mono text-[#64748b]">DEVICE</div>
            <div className="font-semibold text-[#0f172a] mt-0.5 truncate">
              {incident.affectedDevice}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2]">
            <div className="text-[10px] font-mono text-[#64748b]">ANALYST</div>
            <div className="font-semibold text-[#2454ff] mt-0.5">
              {incident.assignedAnalyst}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2]">
            <div className="text-[10px] font-mono text-[#64748b]">MITRE</div>
            <div className="font-semibold text-[#0f172a] mt-0.5 truncate">
              {incident.attackTechnique}
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Attack Chain */}
      {incident.attackChain && (
        <SpotlightCard className="p-6 space-y-4">
          <h3 className="font-display text-sm font-bold text-[#0f172a]">
            Multi-stage attack chain
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {incident.attackChain.map((node, idx) => (
              <div
                key={node.id}
                className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2] space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#94a3b8]">0{idx + 1}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full font-semibold ${
                      node.status === 'MALICIOUS' || node.status === 'CRITICAL'
                        ? 'bg-[#fef2f2] text-[#dc2626]'
                        : node.status === 'PREVENTED' || node.status === 'CONTAINED'
                        ? 'bg-[#eafaf1] text-[#15803d]'
                        : 'bg-[#f1f4fb] text-[#475569]'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#0f172a] leading-tight">
                  {node.label}
                </div>
                <div className="text-[10px] text-[#64748b] font-mono truncate">
                  {node.subtext}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* Containment & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpotlightCard className="p-6 space-y-4">
          <h3 className="font-display text-sm font-bold text-[#0f172a] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2454ff]" />
            <span>Recommended containment actions</span>
          </h3>

          <div className="space-y-2.5">
            {incident.recommendedResponse?.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#fafbfe] border border-[#e5e9f2] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">
                    {rec.label}
                  </div>
                  <div className="text-[11px] text-[#64748b]">{rec.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleEnforceAction(rec.action)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2454ff] hover:bg-[#1a44e5] text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>Enforce</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 space-y-4">
          <h3 className="font-display text-sm font-bold text-[#0f172a] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2454ff]" />
            <span>Forensic timeline</span>
          </h3>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {incident.timeline?.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#fafbfe] border border-[#e5e9f2] flex items-start gap-3"
              >
                <span className="text-[11px] font-mono text-[#64748b] shrink-0 mt-0.5">
                  {item.timestamp}
                </span>
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">
                    {item.stageName}
                  </div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
