'use client';

import { useEffect, useRef } from 'react';
import SectionHeader from '@/components/global/section-header';
import { useContent } from '@/lib/useContent';

export default function MusicSection() {
  const { music } = useContent();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll('.dj-row');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    rows.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [music.djs]);

  return (
    <section id='music' className='py-20 px-6 bg-palooza-deep'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='The Soundtrack' title='Music' />
        <div ref={listRef} className='flex flex-col'>
          {music.djs.map((dj) => (
            <div
              key={dj.name}
              className='dj-row grid items-center gap-4 py-[1.1rem] opacity-0 translate-y-[10px] transition-all duration-500 max-[500px]:grid-cols-[70px_1fr]'
              style={{
                gridTemplateColumns: '80px 1fr auto',
                borderBottom: '1px solid rgba(200, 168, 75, .1)',
              }}
            >
              <div className='text-[0.7rem] tracking-[0.1em] text-palooza-gold'>
                {dj.time}
              </div>
              <div>
                <div className='font-[family-name:var(--font-cinzel)] text-[0.95rem] text-palooza-ivory'>
                  {dj.name}
                </div>
                <div className='font-(family-name:--font-cormorant) italic text-[0.8rem] text-palooza-sand mt-[0.1rem]'>
                  {dj.genre}
                </div>
              </div>
              <div
                className='text-[0.55rem] tracking-[0.15em] uppercase text-palooza-sky py-1 px-2 whitespace-nowrap shrink-0 max-[500px]:hidden'
                style={{
                  background: 'rgba(41, 128, 185, .15)',
                  border: '1px solid rgba(41, 128, 185, .25)',
                }}
              >
                {dj.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
