'use client';

import { useState, useEffect, useRef } from 'react';
import SectionHeader from '@/components/global/section-header';
import { useContent } from '@/lib/useContent';


// Per-element styling (not CMS-managed — design constants)
const ELEMENT_STYLE: Record<string, { badgeClass: string; bgGradient: string; photoSrc: string; photoAlt: string }> = {
  tierra: { badgeClass: 'bg-[rgba(125,78,30,.3)] border border-[rgba(125,78,30,.6)]',   bgGradient: 'linear-gradient(180deg, rgba(125,78,30,.06) 0%, transparent 60%)',    photoSrc: '/event-1.jpg', photoAlt: 'A Mi Manera, San Juan' },
  agua:   { badgeClass: 'bg-[rgba(41,128,185,.25)] border border-[rgba(41,128,185,.5)]', bgGradient: 'linear-gradient(180deg, rgba(41,128,185,.07) 0%, transparent 60%)',  photoSrc: '/event-2.jpg', photoAlt: 'Cala Gracioneta' },
  fuego:  { badgeClass: 'bg-[rgba(192,57,43,.25)] border border-[rgba(192,57,43,.5)]',   bgGradient: 'linear-gradient(180deg, rgba(192,57,43,.07) 0%, transparent 60%)',   photoSrc: '/event-3.jpg', photoAlt: 'Es Molí del Sal' },
  aire:   { badgeClass: 'bg-[rgba(174,214,241,.2)] border border-[rgba(174,214,241,.4)]', bgGradient: 'linear-gradient(180deg, rgba(174,214,241,.05) 0%, transparent 60%)', photoSrc: '/event-4.jpg', photoAlt: 'Jondal Beach' },
};

export default function ScheduleSection() {
  const { schedule } = useContent();
  const DAYS = schedule.days;
  const [activeDay, setActiveDay] = useState(0);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    /* Animate initial timeline items */
    const items = document.querySelectorAll(`#day-panel-${activeDay} .tl-item`);
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 400 + i * 90);
    });
  }, [activeDay]);

  function showDay(i: number) {
    setActiveDay(i);
    setTimeout(() => {
      const items = document.querySelectorAll(`#day-panel-${i} .tl-item`);
      items.forEach((el, j) => {
        setTimeout(() => el.classList.add('visible'), j * 90);
      });
    }, 40);
  }

  return (
    <section id='schedule' className='py-20 px-6 relative bg-palooza-navy'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='The Programme' title='Schedule' />

        {/* Notice banner */}
        <div
          className='flex gap-[0.9rem] items-start p-[1.1rem_1.4rem] mb-8'
          style={{
            border: '1px solid rgba(200, 168, 75, .35)',
            background: 'rgba(200, 168, 75, .06)',
          }}
        >
          <div className='text-[1.1rem] shrink-0 mt-[0.05rem]'>🔒</div>
          <div className='text-[0.82rem] text-palooza-sand leading-[1.65]'>
            <strong className='text-palooza-ivory font-normal'>Private event.</strong>{' '}
            {schedule.noticeBanner}
          </div>
        </div>

        {/* Day tabs */}
        <div
          className='flex gap-0 mb-10 overflow-x-auto'
          style={{
            borderBottom: '1px solid rgba(200, 168, 75, .2)',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {DAYS.map((day, i) => (
            <button
              key={day.element}
              onClick={() => showDay(i)}
              className={`shrink-0 text-[0.58rem] tracking-[0.16em] uppercase py-[0.7rem] px-4 cursor-pointer bg-transparent whitespace-nowrap flex flex-col items-center gap-[0.15rem] transition-colors duration-200 border-0 border-b-2 border-solid ${
                activeDay === i
                  ? 'text-palooza-gold border-b-palooza-gold'
                  : 'text-palooza-sand border-b-transparent'
              }`}
            >
              <span className='text-[0.85rem]'>{day.emoji}</span>
              {day.tabLabel}
            </button>
          ))}
        </div>

        {/* Day panels */}
        {DAYS.map((day, i) => (
          <div
            key={day.element}
            id={`day-panel-${i}`}
            ref={(el) => {
              timelineRefs.current[i] = el;
            }}
            className={activeDay === i ? 'block' : 'hidden'}
            style={{ background: ELEMENT_STYLE[day.element]?.bgGradient }}
          >
            {/* Day photo */}
            <div className='day-photo-overlay relative w-full h-auto mb-8 rounded-sm overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ELEMENT_STYLE[day.element]?.photoSrc}
                alt={ELEMENT_STYLE[day.element]?.photoAlt}
                className='w-full h-[200px] object-cover object-center block brightness-75 saturate-[0.9] rounded-sm'
              />
              <div className='absolute bottom-4 left-6 z-[1]'>
                <div
                  className='font-[family-name:var(--font-cinzel)] text-base text-palooza-ivory tracking-[0.06em]'
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,.5)' }}
                >
                  {day.photo.venue}
                </div>
                <div className='text-[0.58rem] tracking-[0.2em] uppercase text-palooza-gold/80 mt-[0.2rem]'>
                  {day.photo.time}
                </div>
              </div>
            </div>

            {/* Day header */}
            <div className='flex items-center gap-4 mb-8'>
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[1.4rem] shrink-0 ${ELEMENT_STYLE[day.element]?.badgeClass}`}
              >
                {day.emoji}
              </div>
              <div>
                <div className='font-(family-name:--font-cormorant) italic text-2xl text-palooza-ivory'>
                  {day.name}
                </div>
                <div className='text-[0.6rem] tracking-[0.15em] uppercase text-palooza-sand'>
                  {day.date}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className='timeline'>
              {day.timeline.map((item, j) => (
                <div
                  key={j}
                  className='tl-item relative pb-8 pl-6'
                  style={
                    {
                      /* dot */
                    }
                  }
                >
                  {/* Timeline dot */}
                  <div
                    className='absolute -left-1 top-[6px] w-2 h-2 rounded-full bg-palooza-navy'
                    style={{ border: '1px solid #C8A84B' }}
                  />
                  <div className='text-[0.62rem] tracking-[0.15em] text-palooza-gold mb-[0.2rem]'>
                    {item.time}
                  </div>
                  <div className='text-base font-normal text-palooza-ivory mb-[0.15rem]'>
                    {item.event}
                  </div>
                  {item.note && (
                    <div className='font-(family-name:--font-cormorant) italic text-[0.88rem] text-palooza-sand'>
                      {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
