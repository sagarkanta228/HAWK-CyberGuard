'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Shield,
  Activity,
  Terminal,
  Clock,
  User
} from 'lucide-react';

export default function AuditLogsView({
  backendUrl = 'http://127.0.0.1:8000'
}) {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/audit-logs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(() => {});
  }, [backendUrl]);

  const filteredLogs = logs.filter(l =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase()) ||
    l.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2638]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Immutable Telemetry & Security Audit Trail</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Security Audit Trail & Governance Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Complete cryptographic event logging of every AI model classification, analyst countermeasure, and threat containment.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter audit logs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0f141e] border border-[#1e2638] focus:border-cyan-500 text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-[#0f141e] border border-[#1e2638] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080a0f] text-gray-400 border-b border-[#1e2638] uppercase">
              <tr>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Detail</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#121824] transition-colors">
                  <td className="p-4 text-gray-500">{l.timestamp}</td>
                  <td className="p-4 text-white font-semibold flex items-center space-x-1.5">
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>{l.actor}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.action.includes('CONTAINMENT')
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : l.action.includes('PHISH')
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : l.action.includes('MALWARE')
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 font-semibold">{l.target}</td>
                  <td className="p-4 text-gray-400 truncate max-w-xs">{l.detail}</td>
                  <td className="p-4 text-cyan-400">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

