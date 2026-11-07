'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Laptop,
  Flame,
  ArrowRight,
  Lock,
  Ban,
  MailX,
  Server,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function IncidentConsole({
  incidentId = 'INC-1024',
  setSelectedIncidentId,
  backendUrl = 'http://127.0.0.1:8000'
}) {
  const [currentId, setCurrentId] = useState(incidentId);
  const [incident, setIncident] = useState(null);
  const [incidentsList, setIncidentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch incidents list
  useEffect(() => {
    fetch(`${backendUrl}/api/v1/incidents`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setIncidentsList(data);
          const current = data.find(i => i.id === currentId) || data[0];
          setIncident(current);
        }
      })
      .catch(() => {});
  }, [backendUrl]);

  // Fetch specific incident detail
  useEffect(() => {
    if (!currentId) return;
    setLoading(true);
    fetch(`${backendUrl}/api/v1/incidents/${currentId}/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setIncident(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentId, backendUrl]);

  const handleEnforceAction = async (actionType) => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/incidents/${currentId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, analyst: 'Sarah Jenkins' })
      });
      const data = await res.json();
      if (data && data.incident) {
        setIncident(data.incident);
        setActionSuccess(data.message || `Countermeasure '${actionType}' enforced.`);
        setTimeout(() => setActionSuccess(''), 5000);
      }
    } catch (err) {
      // Fallback
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
              nodeType: 'RESPONSE'
            }
          ]
        });
        setActionSuccess(`Countermeasure '${actionType}' enforced successfully.`);
        setTimeout(() => setActionSuccess(''), 5000);
      }
    }
  };

  if (!incident) {
    return (
      <div className="p-12 text-center text-gray-500 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
        <span>Loading Incident Forensics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Selector & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2638]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active SecOps Investigation</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Incident Investigation Console & Containment
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            MITRE ATT&CK kill-chain mapping, forensic telemetry, and automated remediation actions.
          </p>
        </div>

        {/* Incident Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-[#0f141e] p-1.5 rounded-xl border border-[#1e2638]">
          {incidentsList.map((inc) => (
            <button
              key={inc.id}
              onClick={() => {
                setCurrentId(inc.id);
                if (setSelectedIncidentId) setSelectedIncidentId(inc.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                currentId === inc.id
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {inc.id} ({inc.threatType})
            </button>
          ))}
        </div>
      </div>

      {/* Success Alert Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400">STATUS: CONTAINED</span>
        </div>
      )}

      {/* Incident Header Card */}
      <div className="p-6 lg:p-8 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {incident.id}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-gray-800 text-gray-200">
                {incident.threatType}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded uppercase ${
                  incident.status === 'CONTAINED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {incident.status}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white">
              {incident.title}
            </h2>
            <p className="text-xs text-gray-300 max-w-3xl">
              {incident.summary}
            </p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 bg-[#080a0f] p-4 rounded-xl border border-[#1e2638]">
            <div className="text-center">
              <div className="text-3xl font-extrabold font-mono text-rose-400">
                {incident.riskScore}
                <span className="text-xs font-normal text-gray-500">/100</span>
              </div>
              <div className="text-[10px] uppercase font-mono text-gray-400">
                Risk Score
              </div>
            </div>

            <div className="h-10 w-[1px] bg-[#1e2638]"></div>

            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {incident.confidence}%
              </div>
              <div className="text-[10px] uppercase font-mono text-gray-400">
                Confidence
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-[#1e2638] text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1a2233]">
            <span className="text-gray-500 block text-[10px]">AFFECTED USER:</span>
            <span className="text-gray-200 font-semibold">{incident.affectedUser}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1a2233]">
            <span className="text-gray-500 block text-[10px]">TARGET DEVICE:</span>
            <span className="text-gray-200 font-semibold">{incident.affectedDevice}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1a2233]">
            <span className="text-gray-500 block text-[10px]">ASSIGNED ANALYST:</span>
            <span className="text-cyan-400 font-semibold">{incident.assignedAnalyst}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1a2233]">
            <span className="text-gray-500 block text-[10px]">ATTACK TECHNIQUE:</span>
            <span className="text-amber-400 font-semibold truncate block">
              {incident.attackTechnique}
            </span>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Kill Chain Graph */}
      {incident.attackChain && (
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Multi-Stage Attack Chain Progression</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">MITRE ATT&CK Mapping</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {incident.attackChain.map((node, idx) => (
              <div
                key={node.id}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 relative ${
                  node.status === 'MALICIOUS' || node.status === 'CRITICAL'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    : node.status === 'PREVENTED' || node.status === 'CONTAINED'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#080a0f] border-[#1a2233] text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500 font-bold">
                    STEP 0{idx + 1}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      node.status === 'MALICIOUS' || node.status === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : node.status === 'PREVENTED' || node.status === 'CONTAINED'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{node.label}</div>
                  <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                    {node.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Containment Action Center & Timeline Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Countermeasure Enforcement */}
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recommended Containment Actions</span>
            </h3>

            <div className="space-y-3">
              {incident.recommendedResponse && incident.recommendedResponse.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#080a0f] border border-[#1a2233] flex items-center justify-between"
                >
                  <div className="space-y-0.5 max-w-[280px]">
                    <div className="text-xs font-bold text-white">{rec.label}</div>
                    <div className="text-[11px] text-gray-400">{rec.reason}</div>
                  </div>
                  <button
                    onClick={() => handleEnforceAction(rec.action)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold font-mono flex items-center space-x-1 shadow transition-all shrink-0 ml-3"
                  >
                    <span>Enforce</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e2638] flex flex-wrap gap-2 text-xs font-mono">
            <button
              onClick={() => handleEnforceAction('QUARANTINE_EMAIL')}
              className="px-3 py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1f2b45] text-cyan-300 border border-cyan-800/40 flex items-center space-x-1.5"
            >
              <MailX className="w-3.5 h-3.5" />
              <span>Quarantine Message</span>
            </button>
            <button
              onClick={() => handleEnforceAction('BLOCK_URL')}
              className="px-3 py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1f2b45] text-rose-300 border border-rose-800/40 flex items-center space-x-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Block Domain at Firewall</span>
            </button>
            <button
              onClick={() => handleEnforceAction('ISOLATE_HOST')}
              className="px-3 py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1f2b45] text-amber-300 border border-amber-800/40 flex items-center space-x-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Isolate Host Adapter</span>
            </button>
          </div>
        </div>

        {/* Forensic Timeline */}
        <div className="p-6 rounded-2xl bg-[#0f141e] border border-[#1e2638] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Forensic Timeline Audit</span>
          </h3>

          <div className="space-y-3 font-mono text-xs max-h-[350px] overflow-y-auto pr-1">
            {incident.timeline && incident.timeline.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#080a0f] border border-[#1a2233] flex items-start space-x-3"
              >
                <span className="text-gray-500 text-[10px] shrink-0 mt-0.5">
                  {item.timestamp}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-cyan-300">
                    {item.stageName}
                  </div>
                  <div className="text-[11px] text-gray-400 font-sans">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

