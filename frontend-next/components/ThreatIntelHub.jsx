'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, Plus, Search } from 'lucide-react';
import { SpotlightCard } from './motion/MotionPrimitives';

export default function ThreatIntelHub({
  backendUrl = 'http://127.0.0.1:8000',
}) {
  const [iocs, setIocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIoc, setNewIoc] = useState({
    type: 'DOMAIN',
    value: '',
    threatFamily: '',
    severity: 'HIGH',
    description: '',
  });

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/threat-intelligence`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setIocs(data);
      })
      .catch(() => {});
  }, [backendUrl]);

  const handleCopy = (id, val) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddIoc = async (e) => {
    e.preventDefault();
    if (!newIoc.value) return;

    try {
      const res = await fetch(`${backendUrl}/api/v1/threat-intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIoc),
      });
      const data = await res.json();
      setIocs((prev) => [data, ...prev]);
      setShowAddModal(false);
      setNewIoc({
        type: 'DOMAIN',
        value: '',
        threatFamily: '',
        severity: 'HIGH',
        description: '',
      });
    } catch {
      setIocs((prev) => [{ ...newIoc, id: `ioc-${Date.now()}` }, ...prev]);
      setShowAddModal(false);
    }
  };

  const filteredIocs = iocs.filter((ioc) => {
    const matchesSearch =
      ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ioc.threatFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ioc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || ioc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-[1220px] mx-auto py-8 space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#e5e9f2] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-[#2454ff]">
            Global Threat Intelligence
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0f172a] mt-0.5">
            Indicator of Compromise (IOC) Database
          </h1>
          <p className="text-xs text-[#64748b] mt-1">
            Searchable threat indicators correlated across phishing domains,
            malware hashes, and C2 beacons.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add indicator</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e9f2] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain, IP, hash, or family..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fafbfe] border border-[#dce2ee] focus:border-[#2454ff] text-xs text-[#0f172a] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#f1f4fb] p-1 rounded-full text-xs font-medium">
          {['ALL', 'DOMAIN', 'IP', 'HASH'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1 rounded-full transition-all ${
                filterType === t
                  ? 'bg-white text-[#0f172a] shadow-sm font-semibold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <SpotlightCard className="p-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e5e9f2] text-[10px] font-mono uppercase text-[#94a3b8]">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Indicator</th>
                <th className="p-4">Threat Family</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Last Seen</th>
                <th className="p-4 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4fb]">
              {filteredIocs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#fafbfe]">
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#2454ff] text-[11px] font-semibold">
                      {ioc.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-[#0f172a]">
                    <span className="truncate max-w-[260px] block">
                      {ioc.value}
                    </span>
                  </td>
                  <td className="p-4 text-[#475569]">{ioc.threatFamily}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ioc.severity === 'CRITICAL'
                          ? 'bg-[#fef2f2] text-[#dc2626]'
                          : 'bg-[#fff7ed] text-[#c2410c]'
                      }`}
                    >
                      {ioc.severity}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#dc2626]">
                    {ioc.riskScore}/100
                  </td>
                  <td className="p-4 font-mono text-[#64748b]">{ioc.lastSeen}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy(ioc.id, ioc.value)}
                      className="p-1.5 rounded-lg bg-[#f1f4fb] hover:bg-[#e2e8f6] text-[#475569]"
                    >
                      {copiedId === ioc.id ? (
                        <Check className="w-3.5 h-3.5 text-[#15803d]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>

      {showAddModal && (
        <div className="fixed inset-0 bg-[#0f172a]/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#e5e9f2] p-6 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-[#0f172a]">
              Add Threat Intelligence Indicator
            </h3>
            <form onSubmit={handleAddIoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0f172a] mb-1">
                  Type
                </label>
                <select
                  value={newIoc.type}
                  onChange={(e) =>
                    setNewIoc({ ...newIoc, type: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-white border border-[#dce2ee]"
                >
                  <option value="DOMAIN">DOMAIN</option>
                  <option value="IP">IP ADDRESS</option>
                  <option value="HASH">SHA-256 HASH</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#0f172a] mb-1">
                  Value
                </label>
                <input
                  type="text"
                  required
                  value={newIoc.value}
                  onChange={(e) =>
                    setNewIoc({ ...newIoc, value: e.target.value })
                  }
                  placeholder="malicious-c2-beacon.org"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#dce2ee] font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0f172a] mb-1">
                  Threat Family
                </label>
                <input
                  type="text"
                  required
                  value={newIoc.threatFamily}
                  onChange={(e) =>
                    setNewIoc({ ...newIoc, threatFamily: e.target.value })
                  }
                  placeholder="Cobalt Strike / LockBit"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#dce2ee]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f1f4fb] text-[#475569] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2454ff] text-white font-semibold"
                >
                  Commit IOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
