'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPortal from '../../components/LoginPortal';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (operatorData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hawk_user', JSON.stringify(operatorData));
    }
    router.push('/');
  };

  return (
    <LoginPortal onLoginSuccess={handleLoginSuccess} />
  );
}
