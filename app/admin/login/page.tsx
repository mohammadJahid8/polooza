'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* Redirect silently if already authenticated */
  useEffect(() => {
    const token = localStorage.getItem('palooza_admin_token');
    if (token) router.replace('/admin/dashboard');
  }, [router]);

  function showError(msg: string) {
    setError(msg);
    setTimeout(() => setError(''), 3500);
  }

  async function handleLogin() {
    const pw = password.trim();
    if (!pw) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/admin/login', { password: pw });
      localStorage.setItem('palooza_admin_token', data.token);
      router.replace('/admin/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Something went wrong. Please try again.';
      showError(msg);
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div
      className='max-w-[320px] mx-auto mt-16 text-center'
      onKeyDown={handleKeyDown}
    >
      <label className='block text-[0.65rem] tracking-[0.2em] uppercase text-palooza-gold mb-[0.8rem]'>
        Host Password
      </label>
      <input
        className='w-full bg-transparent border-none py-[0.7rem] text-center font-[family-name:var(--font-cinzel)] text-base tracking-[0.3em] text-palooza-ivory outline-none mb-[1.2rem]'
        style={{ borderBottom: '1px solid rgba(200, 168, 75, .4)' }}
        type='password'
        placeholder='· · · · · · · ·'
        autoComplete='current-password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.25em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50'
      >
        {loading ? '...' : 'Access Dashboard ↗'}
      </button>
      {error && (
        <div className='text-[0.7rem] text-palooza-flame text-center mt-2 min-h-4'>
          {error}
        </div>
      )}
    </div>
  );
}
