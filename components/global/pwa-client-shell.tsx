'use client';

import dynamic from 'next/dynamic';

const PwaInstallPrompt = dynamic(
  () => import('@/components/global/pwa-install-prompt'),
  { ssr: false },
);

export default function PwaClientShell() {
  return <PwaInstallPrompt />;
}
