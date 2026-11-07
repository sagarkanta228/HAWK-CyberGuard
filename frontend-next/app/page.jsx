'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CommandCenter from '../components/CommandCenter';
import PhishXScanner from '../components/PhishXScanner';
import MalwareScanner from '../components/MalwareScanner';
import DeepFakeScanner from '../components/DeepFakeScanner';
import IncidentConsole from '../components/IncidentConsole';
import ThreatIntelHub from '../components/ThreatIntelHub';
import AICopilotConsole from '../components/AICopilotConsole';
import AuditLogsView from '../components/AuditLogsView';
import LoginPortal from '../components/LoginPortal';
import DemoModal from '../components/DemoModal';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('ADMIN');
  const [activeView, setActiveView] = useState('command-center');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-1024');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleLoginSuccess = (operatorData) => {
    setIsAuthenticated(true);
    setCurrentRole(operatorData?.role || 'ADMIN');
    setActiveView('command-center');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white flex flex-col font-sans">
      {/* Top Fixed Navbar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 pt-16">
        {/* Fixed Left Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 transition-all ml-64 min-h-[calc(100vh-4rem)]">
          {activeView === 'command-center' && (
            <CommandCenter
              setActiveView={setActiveView}
              setSelectedIncidentId={setSelectedIncidentId}
            />
          )}

          {activeView === 'phishx' && (
            <PhishXScanner
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'ember' && (
            <MalwareScanner
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'deepguard' && (
            <DeepFakeScanner
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'incidents' && (
            <IncidentConsole
              incidentId={selectedIncidentId}
              setSelectedIncidentId={setSelectedIncidentId}
            />
          )}

          {activeView === 'threat-intel' && (
            <ThreatIntelHub />
          )}

          {activeView === 'copilot' && (
            <AICopilotConsole />
          )}

          {activeView === 'audit-logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Interactive Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveView={setActiveView}
        setCurrentRole={setCurrentRole}
        setSelectedIncidentId={setSelectedIncidentId}
      />
    </div>
  );
}
