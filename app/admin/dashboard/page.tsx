'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { RsvpEntry } from '../types';
import DashboardPanel from '../_components/dashboard-panel';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRsvps = useCallback(async () => {
    const token = localStorage.getItem('palooza_admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    try {
      const { data } = await api.get('/api/rsvps', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRsvps(data.rsvps || []);
    } catch {
      // Token expired or invalid
      localStorage.removeItem('palooza_admin_token');
      router.replace('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRsvps();
  }, [fetchRsvps]);

  function handleSignOut() {
    localStorage.removeItem('palooza_admin_token');
    router.replace('/admin/login');
  }

  if (loading) return null;

  return (
    <>
      {/* Top bar */}
      <div className='flex justify-between items-center mb-6'>
        <button
          onClick={() => router.push('/admin/cms')}
          className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-gold/60 hover:text-palooza-gold transition-colors duration-200 font-[family-name:var(--font-jost)] border border-palooza-gold/20 hover:border-palooza-gold/50 px-3 py-1.5'
        >
          CMS ↗
        </button>
        <button
          onClick={handleSignOut}
          className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-ivory/30 hover:text-palooza-flame transition-colors duration-200 font-[family-name:var(--font-jost)]'
        >
          Sign out
        </button>
      </div>

      <DashboardPanel rsvps={rsvps} onRefresh={setRsvps} />
    </>
  );
}
