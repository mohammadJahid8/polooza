'use client';

import SectionHeader from '@/components/global/section-header';
import RevealWrapper from '@/components/global/reveal-wrapper';
import { useContent } from '@/lib/useContent';

export default function TransportSection() {
  const { transport } = useContent();

  return (
    <section id='transport' className='py-20 px-6 bg-palooza-navy'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='Getting Around' title='Transport' />

        {/* Warning banner */}
        <div
          className='flex gap-[0.9rem] items-start p-[1.1rem_1.4rem] mb-[1.2rem]'
          style={{
            border: '1px solid rgba(192, 57, 43, .4)',
            background: 'rgba(192, 57, 43, .07)',
          }}
        >
          <div className='text-[1.1rem] shrink-0 mt-[0.05rem]'>⚠️</div>
          <div className='text-[0.82rem] text-palooza-sand leading-[1.65]'>
            {transport.warningBanner}
          </div>
        </div>

        {/* Transport cards */}
        <div className='flex flex-col gap-4'>
          {transport.items.map((item, i) => (
            <RevealWrapper key={item.type} delay={i * 100}>
              <div className='p-[1.4rem]' style={{ border: '1px solid rgba(200, 168, 75, .18)' }}>
                <div className='text-[1.4rem] mb-2'>{item.icon}</div>
                <div className='text-[0.6rem] tracking-[0.22em] uppercase text-palooza-gold mb-2'>
                  {item.type}
                </div>
                <div className='text-[0.88rem] text-palooza-sand leading-[1.7] whitespace-pre-line'>
                  {item.detail}
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
