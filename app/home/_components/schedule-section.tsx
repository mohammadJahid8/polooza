'use client';

import { useState, useEffect, useRef } from 'react';
import SectionHeader from '@/components/global/section-header';

interface TimelineItem {
  time: string;
  event: string;
  note: string;
}

interface DayData {
  element: string;
  emoji: string;
  tabLabel: string;
  name: string;
  subtitle: string;
  date: string;
  badgeClass: string;
  bgGradient: string;
  photo: { src: string; alt: string; venue: string; time: string };
  timeline: TimelineItem[];
}

const DAYS: DayData[] = [
  {
    element: 'tierra',
    emoji: '🌍',
    tabLabel: 'Thu 30',
    name: 'Tierra — Earth',
    subtitle: 'Thursday, 30 July',
    date: 'Thursday, 30 July',
    badgeClass: 'bg-[rgba(125,78,30,.3)] border border-[rgba(125,78,30,.6)]',
    bgGradient:
      'linear-gradient(180deg, rgba(125,78,30,.06) 0%, transparent 60%)',
    photo: {
      src: '/event-1.jpg',
      alt: 'A Mi Manera, San Juan',
      venue: 'A Mi Manera, San Juan',
      time: 'Thursday · Dinner & Party',
    },
    timeline: [
      {
        time: '20:30',
        event: 'A Mi Manera — Private Takeover',
        note: 'Secret garden dinner & party · San Juan finca',
      },
      {
        time: 'Late',
        event: 'DJ Set — Nfrtiti',
        note: 'Party inside the finca',
      },
      {
        time: '02:30',
        event: 'Close',
        note: 'Big days ahead — rest up (or go out…)',
      },
    ],
  },
  {
    element: 'agua',
    emoji: '🌊',
    tabLabel: 'Fri 31',
    name: 'Agua — Water',
    subtitle: 'Friday, 31 July',
    date: 'Friday, 31 July',
    badgeClass: 'bg-[rgba(41,128,185,.25)] border border-[rgba(41,128,185,.5)]',
    bgGradient:
      'linear-gradient(180deg, rgba(41,128,185,.07) 0%, transparent 60%)',
    photo: {
      src: '/event-2.jpg',
      alt: 'Cala Gracioneta',
      venue: 'First Boat Day — Ibiza Lunch + Blue Marlin',
      time: 'Friday · On the Water',
    },
    timeline: [
      {
        time: '11:30',
        event: 'Boats Depart',
        note: "Meet at Marina Ibiza — don't be late",
      },
      { time: 'Afternoon', event: 'Lunch at Cala Gracioneta', note: '' },
      { time: '19:30', event: 'Blue Marlin', note: 'Palooza returns…' },
      {
        time: 'Late',
        event: 'Afters',
        note: 'Location to be confirmed — watch this space, confirm if you are keen…',
      },
    ],
  },
  {
    element: 'fuego',
    emoji: '🔥',
    tabLabel: 'Sat 1',
    name: 'Fuego — Fire',
    subtitle: 'Saturday, 1 August',
    date: 'Saturday, 1 August',
    badgeClass: 'bg-[rgba(192,57,43,.25)] border border-[rgba(192,57,43,.5)]',
    bgGradient:
      'linear-gradient(180deg, rgba(192,57,43,.07) 0%, transparent 60%)',
    photo: {
      src: '/event-3.jpg',
      alt: 'Es Molí del Sal',
      venue: 'Formentera Boat Day + Private Villa Party',
      time: 'Saturday · The Fire Night',
    },
    timeline: [
      { time: '11:00', event: 'Boats Depart', note: 'Meet at Marina Ibiza' },
      { time: 'Afternoon', event: 'Lunch at Es Molí del Sal', note: '' },
      {
        time: '21:45 till 5am',
        event: 'Private Villa Party',
        note: 'Villa Location revealed closer to the date',
      },
      {
        time: 'Late',
        event: 'Khenya & Paede B2B',
        note: 'Back-to-back headline set',
      },
    ],
  },
  {
    element: 'aire',
    emoji: '💨',
    tabLabel: 'Sun 2',
    name: 'Aire — Air',
    subtitle: 'Sunday, 2 August',
    date: 'Sunday, 2 August',
    badgeClass:
      'bg-[rgba(174,214,241,.2)] border border-[rgba(174,214,241,.4)]',
    bgGradient:
      'linear-gradient(180deg, rgba(174,214,241,.05) 0%, transparent 60%)',
    photo: {
      src: '/event-4.jpg',
      alt: 'Jondal Beach',
      venue: 'Jondal Beach',
      time: 'Sunday · Recovery · till 8pm',
    },
    timeline: [
      { time: '14:30', event: 'Jondal', note: 'Recovery lunch till 8pm' },
    ],
  },
];

export default function ScheduleSection() {
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
            <strong className='text-palooza-ivory font-normal'>
              Private event.
            </strong>{' '}
            This event is strictly for invited guests only. No plus-ones or
            additional guests without prior approval from your host. Please
            speak to Michael directly if you&apos;d like to discuss.
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
            style={{ background: day.bgGradient }}
          >
            {/* Day photo */}
            <div className='day-photo-overlay relative w-full h-auto mb-8 rounded-sm overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={day.photo.src}
                alt={day.photo.alt}
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
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[1.4rem] shrink-0 ${day.badgeClass}`}
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
