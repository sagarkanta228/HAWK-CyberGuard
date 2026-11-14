'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  FileCode,
  Fish,
  ScanFace,
  Shield,
} from 'lucide-react';
import { SpotlightCard } from './motion/MotionPrimitives';

const CHART_SERIES = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    phishx: [24, 28, 42, 39, 44, 52, 58],
    ember: [14, 15, 22, 23, 21, 25, 26],
    deepguard: [6, 7, 10, 9, 12, 11, 13],
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    phishx: [140, 165, 198, 174, 212, 189, 234],
    ember: [78, 92, 105, 88, 114, 96, 119],
    deepguard: [29, 34, 41, 38, 49, 44, 53],
  },
  '30d': {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
    phishx: [520, 610, 580, 690, 740, 710, 815],
    ember: [310, 345, 330, 390, 412, 395, 433],
    deepguard: [110, 128, 145, 162, 179, 195, 210],
  },
};

function MiniSparkline({ points, color }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const coords = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * 180;
      const y = 26 - ((v - min) / span) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 180 30" className="w-full h-7 mt-3 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

export default function CommandCenter({
  backendUrl = 'http://127.0.0.1:8000',
  embedded = false,
}) {
  const [range, setRange] = useState('24h');
  const [stats, setStats] = useState({
    totalScans: 14285,
    threatsPrevented: 1248,
    criticalIncidents: 2,
    activeIncidents: 2,
    systemHealth: 99.98,
  });

  const [incidents, setIncidents] = useState([
    {
      id: 'INC-2041',
      threatType: 'PhishX',
      severity: 'Critical',
      title: 'Credential-harvest page imitating a payroll portal',
      ago: '4 min ago',
    },
    {
      id: 'INC-2040',
      threatType: 'EMBER2024',
      severity: 'Critical',
      title: 'Packed PE dropper flagged by 11 of 14 classifiers',
      ago: '12 min ago',
    },
    {
      id: 'INC-2038',
      threatType: 'DeepGuard',
      severity: 'High',
      title: 'Synthetic voice detected in a finance call recording',
      ago: '41 min ago',
    },
  ]);

  const [detections] = useState([
    {
      time: '00:52',
      engine: 'PhishX',
      artifact: 'secure-login.account-verify.co/session',
      verdict: 'Phishing',
      conf: '97.2%',
    },
    {
      time: '00:45',
      engine: 'EMBER2024',
      artifact: 'invoice_Q3_final.exe',
      verdict: 'Malicious',
      conf: '94.8%',
    },
    {
      time: '00:31',
      engine: 'DeepGuard',
      artifact: 'call_recording_0412.wav',
      verdict: 'Synthetic voice',
      conf: '91.5%',
    },
    {
      time: '00:18',
      engine: 'PhishX',
      artifact: 'docs-share.cloudfiles-login.net',
      verdict: 'Phishing',
      conf: '88.3%',
    },
    {
      time: '00:07',
      engine: 'EMBER2024',
      artifact: 'update_helper.dll',
      verdict: 'Benign',
      conf: '96.1%',
    },
  ]);

  useEffect(() => {
    fetch(`${backendUrl}/api/v1/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalScans) {
          setStats((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    fetch(`${backendUrl}/api/v1/incidents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIncidents(
            data.slice(0, 3).map((inc, idx) => ({
              id: inc.id,
              threatType:
                inc.threatType === 'PHISHING'
                  ? 'PhishX'
                  : inc.threatType === 'MALWARE'
                  ? 'EMBER2024'
                  : 'DeepGuard',
              severity:
                inc.severity === 'CRITICAL'
                  ? 'Critical'
                  : inc.severity === 'HIGH'
                  ? 'High'
                  : 'Medium',
              title: inc.title,
              ago: idx === 0 ? '4 min ago' : idx === 1 ? '12 min ago' : '41 min ago',
            }))
          );
        }
      })
      .catch(() => {});
  }, [backendUrl]);

  const series = CHART_SERIES[range];
  const maxVal = Math.max(...series.phishx) * 1.15;

  const buildPolyline = (values) =>
    values
      .map((v, i) => {
        const x = 16 + (i / (values.length - 1)) * 468;
        const y = 175 - (v / maxVal) * 145;
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div
      className={`space-y-8 ${
        embedded ? '' : 'max-w-[1220px] mx-auto py-8 px-4 sm:px-6'
      }`}
    >
      {/* Row 1: 4 KPI Sparkline Cards matching Page 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-5">
          <div className="text-xs font-medium text-[#64748b]">
            Threats neutralized
          </div>
          <div className="font-display text-3xl font-bold text-[#0f172a] mt-1.5">
            {stats.threatsPrevented.toLocaleString()}
          </div>
          <MiniSparkline points={[12, 16, 15, 22, 24, 29, 34]} color="#2454ff" />
          <div className="text-[11px] font-medium text-[#2454ff] mt-2">
            99.4% automated interception
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <div className="text-xs font-medium text-[#64748b]">
            Active incidents
          </div>
          <div className="font-display text-3xl font-bold text-[#0f172a] mt-1.5">
            {stats.activeIncidents}
          </div>
          <MiniSparkline points={[22, 20, 21, 18, 17, 15, 16]} color="#dc2626" />
          <div className="text-[11px] font-medium text-[#dc2626] mt-2">
            {stats.criticalIncidents} critical priority active
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <div className="text-xs font-medium text-[#64748b]">
            Total AI inferences
          </div>
          <div className="font-display text-3xl font-bold text-[#0f172a] mt-1.5">
            {stats.totalScans.toLocaleString()}
          </div>
          <MiniSparkline points={[10, 14, 13, 19, 24, 28, 36]} color="#7c3aed" />
          <div className="text-[11px] font-medium text-[#7c3aed] mt-2">
            Avg latency 18 ms
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <div className="text-xs font-medium text-[#64748b]">
            Grid reliability
          </div>
          <div className="font-display text-3xl font-bold text-[#0f172a] mt-1.5">
            {stats.systemHealth}%
          </div>
          <MiniSparkline points={[24, 24, 25, 24, 25, 25, 25]} color="#16a34a" />
          <div className="text-[11px] font-medium text-[#15803d] mt-2">
            Neon DB HA cluster
          </div>
        </SpotlightCard>
      </div>

      {/* Row 2: Multi-Series Chart + Incident Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <SpotlightCard className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0f172a]">
                Neutralized threats by engine
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {range === '24h'
                  ? 'Last 24 hours, hourly'
                  : range === '7d'
                  ? 'Last 7 days, daily'
                  : 'Last 30 days, weekly'}
              </p>
            </div>

            <div className="inline-flex items-center rounded-lg bg-[#f1f4fb] p-1 text-xs font-medium">
              {['24h', '7d', '30d'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    range === r
                      ? 'bg-white text-[#0f172a] shadow-sm font-semibold'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="my-5">
            <svg viewBox="0 0 500 205" className="w-full h-48 overflow-visible">
              {[40, 85, 130, 175].map((y) => (
                <line
                  key={y}
                  x1="16"
                  x2="484"
                  y1={y}
                  y2={y}
                  stroke="#eef2f8"
                  strokeWidth="1"
                />
              ))}

              <polyline
                fill="none"
                stroke="#2454ff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildPolyline(series.phishx)}
              />
              {series.phishx.map((v, i) => {
                const x = 16 + (i / (series.phishx.length - 1)) * 468;
                const y = 175 - (v / maxVal) * 145;
                return <circle key={i} cx={x} cy={y} r="3" fill="#2454ff" />;
              })}

              <polyline
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildPolyline(series.ember)}
              />
              {series.ember.map((v, i) => {
                const x = 16 + (i / (series.ember.length - 1)) * 468;
                const y = 175 - (v / maxVal) * 145;
                return <circle key={i} cx={x} cy={y} r="2.8" fill="#7c3aed" />;
              })}

              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildPolyline(series.deepguard)}
              />
              {series.deepguard.map((v, i) => {
                const x = 16 + (i / (series.deepguard.length - 1)) * 468;
                const y = 175 - (v / maxVal) * 145;
                return <circle key={i} cx={x} cy={y} r="2.8" fill="#0d9488" />;
              })}

              {['00:00', '08:00', '16:00', '24:00'].map((lbl, idx) => (
                <text
                  key={lbl}
                  x={16 + idx * 150}
                  y="198"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {range === '24h' ? lbl : series.labels[idx * 2] || lbl}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex items-center gap-5 text-xs text-[#475569] font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#2454ff] inline-block" />
              PhishX
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#7c3aed] inline-block" />
              EMBER2024
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#0d9488] inline-block" />
              DeepGuard
            </span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[#0f172a]">
              Incident queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626] text-[11px] font-semibold">
              {stats.criticalIncidents} critical
            </span>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <Link
                key={inc.id}
                href="/console/incidents"
                className="block p-3.5 rounded-xl bg-[#fafbfe] hover:bg-[#f2f5fc] border border-[#e5e9f2] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#64748b]">
                    {inc.id} · {inc.threatType}
                  </span>
                  <span
                    className={`font-semibold ${
                      inc.severity === 'Critical'
                        ? 'text-[#dc2626]'
                        : 'text-[#d97706]'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#0f172a] mt-1 leading-snug">
                  {inc.title}
                </div>
                <div className="text-[11px] text-[#94a3b8] mt-1">{inc.ago}</div>
              </Link>
            ))}
          </div>

          <Link
            href="/console/incidents"
            className="text-xs font-semibold text-[#2454ff] hover:text-[#1a44e5] inline-flex items-center gap-1 pt-1"
          >
            <span>Open forensics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </SpotlightCard>
      </div>

      {/* Row 3: Three Engines. One View. */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#0f172a]">
          Three engines. One view.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SpotlightCard className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#2454ff] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#0f172a]">
                PhishX Detection Engine
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Dual-layer LightGBM and 1D character CNN. Reads 36 lexical
                entropy attributes and returns a calibrated probability.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  36 lexical features
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  Calibrated CV
                </span>
              </div>
            </div>

            <Link
              href="/console/phishx"
              className="text-xs font-semibold text-[#2454ff] hover:text-[#1a44e5] inline-flex items-center gap-1 pt-2"
            >
              <span>Launch PhishX scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] text-[#7c3aed] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#0f172a]">
                EMBER2024 Malware Sandbox
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                14 benchmark LightGBM classifiers over 2,568 dimensions of byte
                histograms, entropy and PE headers.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  2,568 dimensions
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  14 classifiers
                </span>
              </div>
            </div>

            <Link
              href="/console/ember"
              className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] inline-flex items-center gap-1 pt-2"
            >
              <span>Launch malware sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <ScanFace className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#0f172a]">
                DeepGuard Synthetic Vision
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                MS-EffGCViT vision transformer. Inspects Fourier spectra, face
                boundary blends and audio harmonics.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  MS-EffGCViT
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f4fb] text-[#475569] text-[11px] font-medium">
                  Image, video, audio
                </span>
              </div>
            </div>

            <Link
              href="/console/deepguard"
              className="text-xs font-semibold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1 pt-2"
            >
              <span>Launch DeepFake vision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SpotlightCard>
        </div>
      </div>

      {/* Row 4: Recent Detections Table */}
      <SpotlightCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-[#0f172a]">
            Recent detections
          </h2>
          <Link
            href="/console/audit-logs"
            className="text-xs font-semibold text-[#2454ff] hover:underline"
          >
            View full audit trail →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#e5e9f2] text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">
              <tr>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Engine</th>
                <th className="py-3 pr-4">Artifact</th>
                <th className="py-3 pr-4">Verdict</th>
                <th className="py-3 text-right">Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4fb]">
              {detections.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#fafbfe] transition-colors">
                  <td className="py-3.5 pr-4 font-mono text-[#64748b]">
                    {row.time}
                  </td>
                  <td
                    className={`py-3.5 pr-4 font-semibold ${
                      row.engine === 'PhishX'
                        ? 'text-[#2454ff]'
                        : row.engine === 'EMBER2024'
                        ? 'text-[#7c3aed]'
                        : 'text-[#059669]'
                    }`}
                  >
                    {row.engine}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[#0f172a]">
                    {row.artifact}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        row.verdict === 'Benign'
                          ? 'bg-[#eafaf1] text-[#15803d]'
                          : row.verdict === 'Synthetic voice'
                          ? 'bg-[#fff7ed] text-[#c2410c]'
                          : 'bg-[#fef2f2] text-[#dc2626]'
                      }`}
                    >
                      {row.verdict}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-semibold text-[#0f172a]">
                    {row.conf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>
    </div>
  );
}
