'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/global/section-header';
import api from '@/lib/api';
import { useContent } from '@/lib/useContent';

export default function RsvpSection() {
  const { rsvp: cms } = useContent();

  const [rsvpState, setRsvpState] = useState<Record<string, string>>({});
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Load existing RSVP on mount to pre-fill the form */
  useEffect(() => {
    const token = localStorage.getItem('palooza_token');
    if (!token) return;

    api
      .get('/api/rsvps/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (!data.rsvp) return;
        const r = data.rsvp;
        setName(r.name || '');
        setRsvpState(r.rsvp || {});
        setAllergies(new Set(r.allergies || []));
        setOtherAllergy(r.other || '');
        setSubmitted(true);
      })
      .catch(() => {
        // 404 = no RSVP yet — show empty form
      });
  }, []);

  function showError(msg: string) {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  }

  function rsvpSelect(eventKey: string, answer: string) {
    setRsvpState((prev) => ({ ...prev, [eventKey]: answer }));
  }

  function toggleAllergy(label: string) {
    setAllergies((prev) => {
      const next = new Set(prev);
      if (label === 'None') {
        next.clear();
        next.add('None');
      } else {
        next.delete('None');
        if (next.has(label)) next.delete(label);
        else next.add(label);
      }
      return next;
    });
  }

  async function submitRsvp() {
    if (!name.trim()) {
      showError('Please enter your name');
      return;
    }
    const allAnswered = cms.events.every((e) => rsvpState[e.key]);
    if (!allAnswered) {
      showError('Please respond to every event');
      return;
    }

    const token = localStorage.getItem('palooza_token');
    setLoading(true);
    setError('');
    try {
      await api.post(
        '/api/rsvps/submit',
        {
          name: name.trim(),
          rsvp: rsvpState,
          allergies: [...allergies],
          other: otherAllergy.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Failed to submit. Please try again.';
      showError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section id='rsvp' className='py-20 px-6 bg-palooza-deep'>
        <div className='max-w-[680px] mx-auto'>
          <SectionHeader label='Let Us Know' title='RSVP' />
          <div className='text-center py-8'>
            <div className='text-[2.5rem] mb-4'>🌴</div>
            <div className='font-[family-name:var(--font-cinzel)] text-[1.3rem] text-palooza-ivory mb-2'>
              {cms.successTitle}
            </div>
            <div className='font-(family-name:--font-cormorant) italic text-base text-palooza-sand mb-6'>
              {cms.successText}
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className='text-[0.6rem] tracking-[0.2em] uppercase text-palooza-gold/50 hover:text-palooza-gold transition-colors duration-200 font-[family-name:var(--font-jost)]'
            >
              Edit my RSVP ↗
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='rsvp' className='py-20 px-6 bg-palooza-deep'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='Let Us Know' title='RSVP' />

        <p className='text-[0.88rem] text-palooza-sand leading-[1.7] mb-8'>
          {cms.introText}
        </p>

        {/* Name input */}
        <div className='flex flex-col gap-2 mb-8'>
          <div className='text-[0.6rem] tracking-[0.22em] uppercase text-palooza-gold mb-[0.3rem]'>
            Your Name
          </div>
          <input
            className='w-full bg-transparent border-none py-[0.6rem] font-[family-name:var(--font-jost)] text-[0.95rem] font-light text-palooza-ivory outline-none transition-colors duration-300 placeholder:text-palooza-ivory/25 placeholder:text-[0.85rem]'
            style={{ borderBottom: '1px solid rgba(200, 168, 75, .4)' }}
            type='text'
            placeholder='First and last name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Events label */}
        <div className='text-[0.6rem] tracking-[0.22em] uppercase text-palooza-gold mb-4'>
          Which events will you be attending?
        </div>

        {/* Event cards */}
        <div className='flex flex-col gap-4 mb-8'>
          {cms.events.map((ev) => {
            const answer = rsvpState[ev.key];
            return (
              <div
                key={ev.key}
                className='glass p-[1.2rem_1.4rem] transition-colors duration-300'
                style={{
                  border:
                    answer === 'yes'
                      ? '1px solid rgba(30,132,73,.5)'
                      : answer === 'no'
                        ? '1px solid rgba(192,57,43,.35)'
                        : '1px solid rgba(200,168,75,.18)',
                  background:
                    answer === 'yes'
                      ? 'rgba(30,132,73,.06)'
                      : answer === 'no'
                        ? 'rgba(192,57,43,.05)'
                        : 'rgba(255,255,255,.03)',
                }}
              >
                <div className='flex justify-between items-start gap-4 max-[500px]:flex-col'>
                  <div>
                    <div className='font-[family-name:var(--font-cinzel)] text-[0.9rem] text-palooza-ivory mb-[0.2rem]'>
                      {ev.name}
                    </div>
                    <div className='text-[0.78rem] text-palooza-sand leading-[1.5]'>
                      {ev.detail}
                    </div>
                  </div>
                  <div className='flex gap-2 shrink-0 mt-[0.2rem] max-[500px]:mt-[0.8rem]'>
                    <button
                      onClick={() => rsvpSelect(ev.key, 'yes')}
                      className={`text-[0.6rem] tracking-[0.15em] uppercase py-[0.45rem] px-[0.8rem] cursor-pointer transition-all duration-200 font-[family-name:var(--font-jost)] whitespace-nowrap ${
                        answer === 'yes'
                          ? 'bg-palooza-green text-white'
                          : 'bg-transparent text-[rgba(30,132,73,.8)]'
                      }`}
                      style={{
                        border:
                          answer === 'yes'
                            ? '1px solid #1E8449'
                            : '1px solid rgba(30,132,73,.5)',
                      }}
                    >
                      ✓ Yes
                    </button>
                    <button
                      onClick={() => rsvpSelect(ev.key, 'no')}
                      className={`text-[0.6rem] tracking-[0.15em] uppercase py-[0.45rem] px-[0.8rem] cursor-pointer transition-all duration-200 font-[family-name:var(--font-jost)] whitespace-nowrap ${
                        answer === 'no'
                          ? 'bg-palooza-flame text-white'
                          : 'bg-transparent text-[rgba(192,57,43,.7)]'
                      }`}
                      style={{
                        border:
                          answer === 'no'
                            ? '1px solid #C0392B'
                            : '1px solid rgba(192,57,43,.4)',
                      }}
                    >
                      ✕ No
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Allergies */}
        <div className='mb-8'>
          <div className='text-[0.6rem] tracking-[0.22em] uppercase text-palooza-gold mb-[0.8rem]'>
            Dietary requirements &amp; allergies
          </div>
          <div className='flex flex-wrap gap-2 mb-4'>
            {cms.allergyOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleAllergy(opt)}
                className={`text-[0.7rem] tracking-[0.1em] py-[0.4rem] px-[0.85rem] cursor-pointer transition-all duration-200 font-[family-name:var(--font-jost)] bg-transparent ${
                  allergies.has(opt)
                    ? 'border-palooza-gold text-palooza-gold'
                    : 'text-palooza-sand'
                }`}
                style={{
                  border: allergies.has(opt)
                    ? '1px solid #C8A84B'
                    : '1px solid rgba(200, 168, 75, .25)',
                  background: allergies.has(opt)
                    ? 'rgba(200, 168, 75, .15)'
                    : 'transparent',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <input
            className='w-full bg-transparent border-none py-2 font-[family-name:var(--font-jost)] text-[0.85rem] font-light text-palooza-ivory outline-none transition-colors duration-300 placeholder:text-palooza-ivory/25 placeholder:text-[0.8rem]'
            style={{ borderBottom: '1px solid rgba(200, 168, 75, .3)' }}
            type='text'
            placeholder='Anything else? Please describe…'
            value={otherAllergy}
            onChange={(e) => setOtherAllergy(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={submitRsvp}
          disabled={loading}
          className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-4 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50'
        >
          {loading ? '...' : 'Submit RSVP ↗'}
        </button>
        {error && (
          <div className='text-[0.7rem] tracking-[0.1em] text-palooza-flame text-center min-h-4 mt-[0.8rem]'>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
