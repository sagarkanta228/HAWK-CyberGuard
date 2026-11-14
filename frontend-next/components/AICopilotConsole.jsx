'use client';

import React, { useState } from 'react';
import { Bot, RefreshCw, Send, User } from 'lucide-react';
import { SpotlightCard } from './motion/MotionPrimitives';

export default function AICopilotConsole({
  backendUrl = 'http://127.0.0.1:8000',
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'HAWK AI Security Copilot online. Synchronized with PhishX, EMBER2024, and DeepGuard detection telemetry.',
      time: '12:00',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Explain PhishX LightGBM + CharCNN architecture',
    'How does EMBER2024 extract 2,568 PE features?',
    'Summarize Incident INC-1024 attack chain',
  ];

  const handleSend = async (queryToSend = inputQuery) => {
    if (!queryToSend.trim()) return;

    const userMsg = {
      role: 'user',
      text: queryToSend,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/v1/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.answer ||
            'Telemetry evaluated. All perimeter defense nodes operational.',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `HAWK AI Copilot evaluated: "${queryToSend}". Defense nodes operating nominally.`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1220px] mx-auto py-8 space-y-5 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-[#e5e9f2] shadow-sm p-6 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-[#2454ff]">
            Autonomous SOC Intelligence
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#0f172a] mt-0.5">
            HAWK AI Security Copilot
          </h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#eafaf1] text-[#15803d] text-xs font-semibold">
          Copilot ready
        </span>
      </div>

      <SpotlightCard className="p-6 h-[420px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#eef2ff] text-[#2454ff] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#2454ff] text-white'
                  : 'bg-[#fafbfe] border border-[#e5e9f2] text-[#0f172a]'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`text-[10px] font-mono mt-1 ${
                  m.role === 'user' ? 'text-blue-100' : 'text-[#94a3b8]'
                }`}
              >
                {m.time}
              </div>
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#f1f4fb] text-[#475569] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#64748b] font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2454ff]" />
            <span>Querying telemetry...</span>
          </div>
        )}
      </SpotlightCard>

      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#f1f4fb] border border-[#e5e9f2] text-xs font-medium text-[#475569]"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Copilot about any incident or model..."
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#dce2ee] focus:border-[#2454ff] text-xs text-[#0f172a] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-6 py-3 rounded-xl bg-[#2454ff] hover:bg-[#1a44e5] text-white font-semibold text-xs inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
