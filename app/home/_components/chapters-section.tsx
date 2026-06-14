'use client';

import { useEffect, useRef } from 'react';
import SectionHeader from '@/components/global/section-header';
import { useContent } from '@/lib/useContent';

/* Fixed chapter photos — mapped by index (I → event-5, II → event-6, etc.) */
const CHAPTER_PHOTOS = [
  '/event-5.jpg',
  '/event-6.jpg',
  '/event-7.jpg',
  '/event-8.jpg',
  '/event-9.jpg',
];

export default function ChaptersSection() {
  const { chapters } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.chapter-item');
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
    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [chapters.items]);

  return (
    <section id='history' className='py-20 px-6 bg-palooza-navy'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='The Journey' title='The Chapters' />
        <div ref={containerRef} className='flex flex-col gap-0'>
          {chapters.items.map((ch, idx) => (
            <div
              key={ch.num}
              className='chapter-item grid gap-4 py-[1.2rem] opacity-0 -translate-x-3 transition-all duration-600'
              style={{
                gridTemplateColumns: '48px 1fr',
                borderBottom: '1px solid rgba(200, 168, 75, .08)',
              }}
            >
              <div
                className='font-[family-name:var(--font-cinzel)] text-[2rem] font-normal text-palooza-gold/20 leading-none text-right pr-2'
                style={{ borderRight: '1px solid rgba(200, 168, 75, .1)' }}
              >
                {ch.num}
              </div>
              <div>
                {/* Chapter photo */}
                {CHAPTER_PHOTOS[idx] && (
                  <div className='relative overflow-hidden mb-[0.8rem]'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CHAPTER_PHOTOS[idx]}
                      alt={`Chapter ${ch.num} — ${ch.title}`}
                      className='w-full h-[200px] object-cover object-center block brightness-75 saturate-[0.9] transition-[filter] duration-400 hover:brightness-[0.9] hover:saturate-100'
                    />
                    {/* Bottom fade overlay */}
                    <div
                      className='absolute inset-0 pointer-events-none'
                      style={{
                        background:
                          'linear-gradient(to bottom, transparent 50%, #0B1E33 100%)',
                      }}
                    />
                  </div>
                )}
                <div className='text-[0.6rem] tracking-[0.2em] uppercase text-palooza-gold mb-[0.3rem]'>
                  {ch.location}
                </div>
                <div className='font-[family-name:var(--font-cinzel)] text-[0.9rem] text-palooza-ivory tracking-[0.05em]'>
                  {ch.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current chapter */}
        <div
          className='relative overflow-hidden mt-6 p-[1.4rem]'
          style={{
            border: '1px solid rgba(200, 168, 75, .3)',
            background: 'rgba(200, 168, 75, .05)',
          }}
        >
          <div
            className='absolute top-0 left-0 right-0 h-[2px]'
            style={{
              background:
                'linear-gradient(90deg, transparent, #C8A84B, transparent)',
            }}
          />
          <div className='text-[0.55rem] tracking-[0.28em] uppercase text-palooza-gold mb-2'>
            {chapters.currentLabel}
          </div>
          <div className='font-[family-name:var(--font-cinzel)] text-[1.3rem] text-palooza-ivory mb-[0.3rem]'>
            {chapters.currentTitle}
          </div>
          <div className='font-(family-name:--font-cormorant) italic text-base text-palooza-sand'>
            {chapters.currentSub}
          </div>
        </div>
      </div>
    </section>
  );
}
