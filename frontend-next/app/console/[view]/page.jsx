import React from 'react';
import ConsoleShell from '../../../components/ConsoleShell';

export default function ConsoleSectionPage({ params }) {
  return <ConsoleShell initialView={params?.view || 'command-center'} />;
}

