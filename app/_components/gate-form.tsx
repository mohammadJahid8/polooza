'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GateForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const checked = useRef(false);
  const [ready, setReady] = useState(false);

  /* Redirect if already authenticated, otherwise show the form */
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const token = localStorage.getItem('palooza_token');
    if (token) {
      router.replace('/home');
    } else {
      setReady(true);
    }
  }, [router]);

  function showError(msg: string, ms = 4000) {
    setError(msg);
    setTimeout(() => setError(''), ms);
  }

  /* ── Step 1: Send OTP ──────────────────────────────────────────────────── */
  async function sendCode() {
    const trimmed = phone.trim();

    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/send-otp', { phone: trimmed });
      setStep(2);
      setTimeout(() => codeRef.current?.focus(), 300);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Something went wrong. Please try again.';
      showError(msg);
    } finally {
      setLoading(false);
    }
  }

  /* ── Step 2: Verify OTP ────────────────────────────────────────────────── */
  async function verifyCode() {
    const trimmed = code.trim();
    if (!trimmed || trimmed.length !== 6) {
      showError('Enter the 6-digit code', 3000);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/verify-otp', {
        phone: phone.trim(),
        code: trimmed,
      });
      localStorage.setItem('palooza_token', data.token);
      localStorage.setItem('palooza_phone', phone.trim());
      router.push('/home');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Incorrect code. Please try again.';
      showError(msg);
      setCode('');
    } finally {
      setLoading(false);
    }
  }

  function backToPhone() {
    setStep(1);
    setCode('');
    setError('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (step === 1) sendCode();
      else verifyCode();
    }
  }

  /* Auto-verify when 6 digits entered */
  useEffect(() => {
    if (code.length === 6) verifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!ready) return null;

  return (
    <div onKeyDown={handleKeyDown}>
      {/* ── Step 1: Phone number ── */}
      {step === 1 && (
        <div className='flex flex-col items-center gap-[0.9rem] w-full max-w-[280px] opacity-0 animate-[fadeUp_1s_ease_1s_forwards]'>
          <label className='self-start text-[0.6rem] uppercase tracking-[0.25em] text-palooza-sand'>
            Your mobile number
          </label>
          <input
            className='w-full bg-transparent border-none border-b border-b-palooza-gold/50 py-[0.65rem] text-center font-[family-name:var(--font-cinzel)] text-[0.95rem] tracking-[0.1em] text-palooza-ivory outline-none transition-colors duration-300 focus:border-b-palooza-gold2 placeholder:text-palooza-ivory/20 placeholder:tracking-[0.15em] placeholder:text-[0.75rem] placeholder:font-[family-name:var(--font-jost)]'
            style={{ borderBottom: '1px solid rgba(200, 168, 75, .5)' }}
            type='tel'
            placeholder='+44 7700 000000'
            autoComplete='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className='text-[0.6rem] tracking-[0.12em] text-palooza-ivory/35 text-center mt-[0.2rem]'>
            We&apos;ll send you a verification code
          </div>
          <button
            className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 mt-[0.8rem] hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50'
            onClick={sendCode}
            disabled={loading}
          >
            {loading ? '...' : 'Send Code ↗'}
          </button>
          {error && (
            <div className='text-[0.7rem] tracking-[0.1em] text-palooza-flame text-center min-h-4 mt-[0.2rem]'>
              {error}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: OTP code ── */}
      {step === 2 && (
        <div className='flex flex-col items-center gap-[0.9rem] w-full max-w-[280px] opacity-0 animate-[fadeUp_1s_ease_0.2s_forwards]'>
          <label className='self-start text-[0.6rem] uppercase tracking-[0.25em] text-palooza-sand'>
            Enter your code
          </label>
          <input
            ref={codeRef}
            className='w-full bg-transparent border-none py-[0.65rem] text-center font-[family-name:var(--font-cinzel)] text-[1.4rem] tracking-[0.4em] text-palooza-ivory outline-none transition-colors duration-300 focus:border-b-palooza-gold2 placeholder:text-palooza-ivory/20 placeholder:tracking-[0.15em] placeholder:text-[0.75rem] placeholder:font-[family-name:var(--font-jost)]'
            style={{ borderBottom: '1px solid rgba(200, 168, 75, .5)' }}
            type='tel'
            placeholder='· · · · · ·'
            maxLength={6}
            autoComplete='one-time-code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className='text-[0.6rem] tracking-[0.12em] text-palooza-ivory/35 text-center mt-[0.2rem]'>
            Code sent to {phone}
          </div>
          <button
            className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-[0.9rem] cursor-pointer transition-all duration-300 mt-[0.8rem] hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50'
            onClick={verifyCode}
            disabled={loading}
          >
            {loading ? '...' : 'Verify ↗'}
          </button>
          <button
            onClick={backToPhone}
            className='bg-none border-none text-palooza-gold/40 font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.2em] uppercase cursor-pointer mt-[0.3rem]'
          >
            ← Change number
          </button>
          {error && (
            <div className='text-[0.7rem] tracking-[0.1em] text-palooza-flame text-center min-h-4 mt-[0.2rem]'>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
