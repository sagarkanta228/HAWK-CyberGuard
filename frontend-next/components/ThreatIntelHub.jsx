'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Plus,
  Filter,
  ShieldAlert,
  Hash,
  Server,
  Link,
  Download,
  Copy,
  Check
} from 'lucide-react';

export default function ThreatIntelHub({
  backendUrl = 'http://127.0.0.1:8000'
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
    description: ''
  });

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/threat-intelligence`)
      .then(res => res.json())
      .then(data => {
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
        body: JSON.stringify(newIoc)
      });
      const data = await res.json();
      setIocs(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewIoc({ type: 'DOMAIN', value: '', threatFamily: '', severity: 'HIGH', description: '' });
    } catch (err) {
      setIocs(prev => [{ ...newIoc, id: `ioc-${Date.now()}` }, ...prev]);
      setShowAddModal(false);
    }
  };

  const filteredIocs = iocs.filter(ioc => {
    const matchesSearch =
      ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ioc.threatFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ioc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || ioc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2638]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Threat Intelligence Feeds</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Threat Intelligence & Indicator Database
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Searchable indicators of compromise (IOCs) correlated against global malware hashes, phishing domains, and rogue infrastructure.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Indicator</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain, IP address, hash, or malware family..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080a0f] border border-[#1e2638] focus:border-cyan-500 text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center space-x-2 text-xs font-mono self-end md:self-auto">
          {['ALL', 'DOMAIN', 'IP', 'HASH'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterType === t
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                  : 'bg-[#080a0f] text-gray-400 border-[#1e2638] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* IOC Table */}
      <div className="rounded-2xl bg-[#0f141e] border border-[#1e2638] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080a0f] text-gray-400 border-b border-[#1e2638] uppercase">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Indicator Value</th>
                <th className="p-4">Threat Family</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Last Observed</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638]">
              {filteredIocs.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-[#121824] transition-colors">
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ioc.type === 'DOMAIN'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : ioc.type === 'IP'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {ioc.type}
                    </span>
                  </td>
                  <td className="p-4 text-white font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-[280px]">{ioc.value}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{ioc.threatFamily}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ioc.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400'
                          : ioc.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {ioc.severity}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-rose-400">{ioc.riskScore}/100</td>
                  <td className="p-4 text-gray-500">{ioc.lastSeen}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleCopy(ioc.id, ioc.value)}
                      className="p-1.5 rounded-lg bg-[#080a0f] hover:bg-[#1a2233] text-gray-400 hover:text-white transition-colors"
                      title="Copy Indicator Value"
                    >
                      {copiedId === ioc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
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
      </div>

      {/* Add IOC Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f141e] border border-[#1e2638] p-6 space-y-4 shadow-2xl animate-fadeIn">
            <h3 className="text-base font-bold text-white">Add Threat Intelligence Indicator</h3>
            <form onSubmit={handleAddIoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-mono mb-1">Indicator Type</label>
                <select
                  value={newIoc.type}
                  onChange={(e) => setNewIoc({ ...newIoc, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white font-mono"
                >
                  <option value="DOMAIN">DOMAIN</option>
                  <option value="IP">IP ADDRESS</option>
                  <option value="HASH">FILE HASH (SHA-256)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Indicator Value</label>
                <input
                  type="text"
                  required
                  value={newIoc.value}
                  onChange={(e) => setNewIoc({ ...newIoc, value: e.target.value })}
                  placeholder="e.g. malicious-c2-beacon.org"
                  className="w-full p-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono mb-1">Threat Family</label>
                <input
                  type="text"
                  required
                  value={newIoc.threatFamily}
                  onChange={(e) => setNewIoc({ ...newIoc, threatFamily: e.target.value })}
                  placeholder="e.g. Cobalt Strike / LockBit"
                  className="w-full p-2.5 rounded-xl bg-[#080a0f] border border-[#1e2638] text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-mono hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold font-mono"
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

