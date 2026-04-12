'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Lazy initializer runs once on mount — avoids setState inside an effect
  const [ready] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('palooza_token');
  });

  useEffect(() => {
    if (!ready) {
      router.replace('/');
    }
  }, [ready, router]);

  if (!ready) return null;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
