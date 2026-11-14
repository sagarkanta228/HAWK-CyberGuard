'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MobileSignInScreen from '../../../components/mobile/MobileSignInScreen';

export default function MobileLoginPage() {
  const router = useRouter();

  const handleNavigate = (screen) => {
    if (screen === 'scan') router.push('/mobile/scan');
    else if (screen === 'alerts') router.push('/mobile/alerts');
  };

  return (
    <div className="w-full min-h-screen bg-[#f2f6fd] flex justify-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-xl">
        <MobileSignInScreen onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
