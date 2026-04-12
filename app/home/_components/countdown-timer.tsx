'use client';

import { useEffect, useState } from 'react';

const TARGET = new Date('2026-07-30T20:30:00+02:00').getTime();

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: '--',
    hours: '--',
    mins: '--',
    secs: '--',
  });

  useEffect(() => {
    function update() {
      const diff = TARGET - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: '0', hours: '0', mins: '0', secs: '0' });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        days: String(d),
        hours: String(h),
        mins: String(m),
        secs: String(s),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.mins, label: 'Mins' },
    { value: timeLeft.secs, label: 'Secs' },
  ];

  return (
    <div className='flex gap-6 justify-center mt-[1.2rem] opacity-0 animate-[fadeUp_1s_ease_1.15s_forwards]'>
      {units.map((u, i) => (
        <div key={u.label} className='flex items-center gap-6'>
          <div className='flex flex-col items-center gap-[0.2rem]'>
            <div className='font-[family-name:var(--font-cinzel)] text-[1.6rem] text-palooza-ivory leading-none min-w-[2ch] text-center'>
              {u.value}
            </div>
            <div className='text-[0.5rem] tracking-[0.22em] uppercase text-palooza-gold/60'>
              {u.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <div className='font-[family-name:var(--font-cinzel)] text-[1.4rem] text-palooza-gold/30 self-start mt-[0.1rem]'>
              ·
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
