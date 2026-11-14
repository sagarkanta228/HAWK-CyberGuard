'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { SpotlightCard } from './motion/MotionPrimitives';

export default function AuditLogsView({
  backendUrl = 'http://127.0.0.1:8000',
}) {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/audit-logs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch(() => {});
  }, [backendUrl]);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1220px] mx-auto py-8 space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#e5e9f2] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-[#2454ff]">
            Governance &amp; Telemetry
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0f172a] mt-0.5">
            Security Audit Trail
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Immutable event log of AI classifications and analyst containment actions.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter audit logs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fafbfe] border border-[#dce2ee] focus:border-[#2454ff] text-xs text-[#0f172a] focus:outline-none"
          />
        </div>
      </div>

      <SpotlightCard className="p-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e5e9f2] text-[10px] font-mono uppercase text-[#94a3b8]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target</th>
                <th className="p-4">Detail</th>
                <th className="p-4">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4fb]">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#fafbfe]">
                  <td className="p-4 font-mono text-[#64748b]">{l.timestamp}</td>
                  <td className="p-4 font-semibold text-[#0f172a]">{l.actor}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        l.action.includes('CONTAINMENT') ||
                        l.action.includes('COUNTERMEASURE')
                          ? 'bg-[#fef2f2] text-[#dc2626]'
                          : 'bg-[#eef2ff] text-[#2454ff]'
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[#0f172a]">{l.target}</td>
                  <td className="p-4 text-[#475569] truncate max-w-xs">
                    {l.detail}
                  </td>
                  <td className="p-4 font-mono text-[#64748b]">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>
    </div>
  );
}
