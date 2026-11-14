'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPortal from '../../components/LoginPortal';

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = (operatorData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hawk_user', JSON.stringify(operatorData));
    }
    router.push('/console');
  };

  return <LoginPortal mode="signup" onLoginSuccess={handleSignupSuccess} />;
}

