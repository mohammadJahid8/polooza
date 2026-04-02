'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/global/section-header';

const EVENTS = [
  {
    key: 'soho',
    name: 'A Mi Manera — Dinner & Party',
    detail: 'Thursday 30 July · 20:30 till late · Secret garden takeover',
  },
  {
    key: 'boats-fri',
    name: 'Boats + Cala Gracioneta Lunch',
    detail: 'Friday 31 July · Depart Marina Ibiza 11:00am',
  },
  {
    key: 'bluemarlin',
    name: 'Blue Marlin',
    detail: 'Friday 31 July · 19:30 till late',
  },
  {
    key: 'boats-sat',
    name: 'Boats + Es Molí del Sal Lunch',
    detail: 'Saturday 1 August · Depart Marina Ibiza 11:00am',
  },
  {
    key: 'villa',
    name: 'Private Villa Party — Khenya & Paede B2B',
    detail: 'Saturday 1 August · 21:45 till very late',
  },
  {
    key: 'jondal',
    name: 'Jondal Recovery Lunch',
    detail: 'Sunday 2 August · 14:30 till 8pm',
  },
];

const ALLERGY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Shellfish allergy',
  'Halal',
  'Kosher',
  'None',
];

export default function RsvpSection() {
  const [rsvpState, setRsvpState] = useState<Record<string, string>>({});
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    /* Check if already submitted */
    const phone = localStorage.getItem('palooza_phone') || '';
    const rsvps = JSON.parse(localStorage.getItem('palooza_rsvps') || '[]');
    const existing = rsvps.find((r: { phone: string }) => r.phone === phone);
    if (existing) setSubmitted(true);
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

  function submitRsvp() {
    if (!name.trim()) {
      showError('Please enter your name');
      return;
    }
    const allAnswered = EVENTS.every((e) => rsvpState[e.key]);
    if (!allAnswered) {
      showError('Please respond to every event');
      return;
    }

    const phone = localStorage.getItem('palooza_phone') || '';
    const data = {
      phone,
      name: name.trim(),
      rsvp: rsvpState,
      allergies: [...allergies],
      other: otherAllergy.trim(),
      submittedAt: new Date().toISOString(),
    };

    const all = JSON.parse(localStorage.getItem('palooza_rsvps') || '[]');
    const idx = all.findIndex((r: { phone: string }) => r.phone === data.phone);
    if (idx >= 0) all[idx] = data;
    else all.push(data);
    localStorage.setItem('palooza_rsvps', JSON.stringify(all));

    // Also post to API
    fetch('/.netlify/functions/save-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id='rsvp' className='py-20 px-6 bg-palooza-deep'>
        <div className='max-w-[680px] mx-auto'>
          <SectionHeader label='Let Us Know' title='RSVP' />
          <div className='text-center py-8'>
            <div className='text-[2.5rem] mb-4'>🌴</div>
            <div className='font-[family-name:var(--font-cinzel)] text-[1.3rem] text-palooza-ivory mb-2'>
              You&apos;re confirmed
            </div>
            <div className='font-(family-name:--font-cormorant) italic text-base text-palooza-sand'>
              Thank you — we have everything we need. See you in Ibiza.
            </div>
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
          Please confirm your attendance for each event and let us know about
          any dietary requirements. This helps with planning and means we can
          make sure you&apos;re looked after at every venue. Once you confirm,
          you are in…!
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
          {EVENTS.map((ev) => {
            const answer = rsvpState[ev.key];
            const cardClass =
              answer === 'yes'
                ? 'border-[rgba(30,132,73,.5)] bg-[rgba(30,132,73,.06)]'
                : answer === 'no'
                  ? 'border-[rgba(192,57,43,.35)] bg-[rgba(192,57,43,.05)]'
                  : 'border-[rgba(200,168,75,.18)]';

            return (
              <div
                key={ev.key}
                className={`glass p-[1.2rem_1.4rem] transition-colors duration-300 ${cardClass}`}
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
                  animation: answer === 'yes' ? 'goldPulse .6s ease' : 'none',
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
                          ? 'bg-palooza-green text-white border-palooza-green'
                          : 'bg-transparent text-[rgba(30,132,73,.8)] border-[rgba(30,132,73,.5)]'
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
                          ? 'bg-palooza-flame text-white border-palooza-flame'
                          : 'bg-transparent text-[rgba(192,57,43,.7)] border-[rgba(192,57,43,.4)]'
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
            {ALLERGY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleAllergy(opt)}
                className={`text-[0.7rem] tracking-[0.1em] py-[0.4rem] px-[0.85rem] cursor-pointer transition-all duration-200 font-[family-name:var(--font-jost)] bg-transparent ${
                  allergies.has(opt)
                    ? 'bg-[rgba(200,168,75,.15)] border-palooza-gold text-palooza-gold'
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
          className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.65rem] tracking-[0.28em] uppercase py-4 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy'
        >
          Submit RSVP ↗
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
