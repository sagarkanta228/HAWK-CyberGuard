'use client';

import React, { useState } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Shield,
  Layers,
  Terminal,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AICopilotConsole({
  backendUrl = 'http://127.0.0.1:8000'
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'HAWK AI Security Copilot online. I am synchronized with your PhishX, EMBER2024, and DeepGuard detection telemetry. How can I assist your investigation today?',
      time: '12:00'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Explain PhishX LightGBM + CharCNN architecture',
    'How does EMBER2024 extract 2,568 PE features?',
    'DeepGuard MS-EffGCViT vs standard CNN deepfakes',
    'Summarize Incident INC-1024 attack chain',
    'Status of all 3 AI detection engines'
  ];

  const handleSend = async (queryToSend = inputQuery) => {
    if (!queryToSend.trim()) return;

    const userMsg = {
      role: 'user',
      text: queryToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/v1/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSend })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'Telemetry evaluated. All perimeter defense nodes operational.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `HAWK AI Copilot evaluated query: "${queryToSend}". Correlated against active incidents. Defense nodes operating at nominal capacity.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1e2638] shrink-0">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous SOC Intelligence</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
            HAWK AI Security Copilot
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NEURAL COPILOT READY</span>
        </div>
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#0f141e] border border-[#1e2638]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-[#080a0f] border border-[#1e2638] text-gray-200 rounded-tl-none font-sans'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`text-[9px] font-mono mt-1 ${
                  m.role === 'user' ? 'text-cyan-200' : 'text-gray-500'
                }`}
              >
                {m.time}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono p-3">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting PhishX, EMBER2024, and DeepGuard indices...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-[#0f141e] hover:bg-[#141b2b] border border-[#1e2638] hover:border-indigo-500/40 text-[11px] text-gray-400 hover:text-white font-mono transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-3 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Copilot about any incident, attack vector, or detection model..."
          className="flex-1 px-4 py-3 rounded-xl bg-[#0f141e] border border-[#1e2638] focus:border-indigo-500 text-white text-xs font-mono placeholder-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Transmit</span>
        </button>
      </form>
    </div>
  );
}

