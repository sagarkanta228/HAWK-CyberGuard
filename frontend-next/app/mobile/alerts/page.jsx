'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MobileAlertsScreen from '../../../components/mobile/MobileAlertsScreen';

export default function MobileAlertsPage() {
  const router = useRouter();

  const handleNavigate = (screen) => {
    if (screen === 'login') router.push('/mobile/login');
    else if (screen === 'scan') router.push('/mobile/scan');
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fc] flex justify-center">
      <div className="w-full max-w-[420px] bg-[#f7f9fc] min-h-screen shadow-xl">
        <MobileAlertsScreen onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
