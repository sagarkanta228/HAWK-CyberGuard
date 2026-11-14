'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import CommandCenter from './CommandCenter';
import PhishXScanner from './PhishXScanner';
import MalwareScanner from './MalwareScanner';
import DeepFakeScanner from './DeepFakeScanner';
import IncidentConsole from './IncidentConsole';
import ThreatIntelHub from './ThreatIntelHub';
import AICopilotConsole from './AICopilotConsole';
import AuditLogsView from './AuditLogsView';
import { EASE_OUT_EXPO } from './motion/MotionPrimitives';

export const ALLOWED_CONSOLE_VIEWS = [
  'command-center',
  'phishx',
  'ember',
  'deepguard',
  'incidents',
  'threat-intel',
  'copilot',
  'audit-logs',
];

export default function ConsoleShell({ initialView = 'command-center' }) {
  const router = useRouter();
  const safeView = ALLOWED_CONSOLE_VIEWS.includes(initialView)
    ? initialView
    : 'command-center';

  const [operatorUser, setOperatorUser] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem('hawk_user');
    if (raw) {
      try {
        setOperatorUser(JSON.parse(raw));
      } catch {
        // ignore invalid stored payload
      }
    }
  }, []);

  const navigateToView = (view) => {
    if (view === 'command-center') {
      router.push('/console');
    } else if (ALLOWED_CONSOLE_VIEWS.includes(view)) {
      router.push(`/console/${view}`);
    } else {
      router.push('/console');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hawk_user');
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#0f172a] flex flex-col">
      <Navbar
        activeView={safeView}
        operatorUser={operatorUser}
        onLogout={handleLogout}
        variant="console"
      />

      <main className="flex-1 px-4 sm:px-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={safeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          >
            {safeView === 'command-center' && (
              <CommandCenter
                setActiveView={navigateToView}
                setSelectedIncidentId={setSelectedIncidentId}
              />
            )}
            {safeView === 'phishx' && (
              <PhishXScanner setActiveView={navigateToView} />
            )}
            {safeView === 'ember' && (
              <MalwareScanner setActiveView={navigateToView} />
            )}
            {safeView === 'deepguard' && (
              <DeepFakeScanner setActiveView={navigateToView} />
            )}
            {safeView === 'incidents' && (
              <IncidentConsole
                incidentId={selectedIncidentId}
                setSelectedIncidentId={setSelectedIncidentId}
              />
            )}
            {safeView === 'threat-intel' && <ThreatIntelHub />}
            {safeView === 'copilot' && <AICopilotConsole />}
            {safeView === 'audit-logs' && <AuditLogsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
