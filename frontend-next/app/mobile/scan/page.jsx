'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MobileScanScreen from '../../../components/mobile/MobileScanScreen';

export default function MobileScanPage() {
  const router = useRouter();

  const handleNavigate = (screen) => {
    if (screen === 'login') router.push('/mobile/login');
    else if (screen === 'alerts') router.push('/mobile/alerts');
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fc] flex justify-center">
      <div className="w-full max-w-[420px] bg-[#f7f9fc] min-h-screen shadow-xl">
        <MobileScanScreen onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
