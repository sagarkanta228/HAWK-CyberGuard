'use client';

import React from 'react';
import Navbar from './Navbar';
import EarthScrollExperience from './EarthScrollExperience';
import { ScrollProgressBeam } from './motion/MotionPrimitives';

export default function LandingShowcase() {
  return (
    <div className="min-h-screen bg-[#f5f7fc] text-[#0f172a]">
      <ScrollProgressBeam />
      <Navbar activeView="main" variant="landing" />
      <EarthScrollExperience />
    </div>
  );
}
