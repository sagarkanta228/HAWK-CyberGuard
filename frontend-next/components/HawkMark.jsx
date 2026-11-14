import React from 'react';

export function HawkGeometricMark({ className = 'w-8 h-8' }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-[#2454ff] text-white shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-[58%] h-[58%]"
        aria-hidden="true"
      >
        <path
          d="M6 6.5L12 10.5L18 6.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 11.5L12 14.5L16.5 11.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10.5V19"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
