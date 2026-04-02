'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/global/section-header';

interface UpdateEntry {
  date: string;
  text: string;
}

const ADMIN_PASSWORD = 'palooza2025host';

export default function UpdatesSection() {
  const [updates, setUpdates] = useState<UpdateEntry[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [adminMsg, setAdminMsg] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('palooza_updates') || '[]');
    setUpdates(stored);
  }, []);

  function postUpdate() {
    if (adminPw.trim() !== ADMIN_PASSWORD) {
      setAdminError('Incorrect password');
      setTimeout(() => setAdminError(''), 3000);
      return;
    }
    if (!adminMsg.trim()) {
      setAdminError('Please write an update');
      setTimeout(() => setAdminError(''), 3000);
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newUpdate = { date: dateStr, text: adminMsg.trim() };
    const next = [...updates, newUpdate];
    setUpdates(next);
    localStorage.setItem('palooza_updates', JSON.stringify(next));
    setAdminMsg('');
    setAdminPw('');
    setShowAdmin(false);
  }

  return (
    <section id='updates' className='py-20 px-6 bg-palooza-navy'>
      <div className='max-w-[680px] mx-auto'>
        <SectionHeader label='From Your Host' title='Updates' />
        <p className='text-[0.85rem] text-palooza-sand leading-[1.7] mb-8'>
          Check here for the latest news, changes, and messages about the
          weekend. When a new update is posted, you&apos;ll receive a text
          message.
        </p>

        {/* Update feed */}
        <div className='flex flex-col gap-4 mb-8'>
          {updates.length === 0 ? (
            <div className='font-(family-name:--font-cormorant) italic text-base text-palooza-sand text-center py-8 opacity-60'>
              No updates yet — check back closer to the date.
            </div>
          ) : (
            [...updates].reverse().map((u, i) => (
              <div
                key={i}
                className='py-[0.9rem] px-[1.2rem] relative'
                style={{
                  borderLeft: '2px solid #C8A84B',
                  background: 'rgba(200, 168, 75, .05)',
                }}
              >
                <div className='text-[0.58rem] tracking-[0.2em] uppercase text-palooza-gold mb-[0.3rem]'>
                  {u.date}
                </div>
                <div className='text-[0.9rem] text-palooza-ivory leading-[1.6]'>
                  {u.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Admin toggle */}
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className='block mx-auto text-[0.6rem] tracking-[0.2em] uppercase text-palooza-gold/35 bg-none border-none cursor-pointer font-[family-name:var(--font-jost)] py-2 hover:text-palooza-gold'
        >
          Host access ···
        </button>

        {/* Admin panel */}
        {showAdmin && (
          <div
            className='mt-6 p-[1.4rem]'
            style={{
              border: '1px solid rgba(200, 168, 75, .2)',
              background: 'rgba(200, 168, 75, .04)',
            }}
          >
            <label className='block text-[0.58rem] tracking-[0.22em] uppercase text-palooza-gold mb-[0.6rem]'>
              Admin password
            </label>
            <input
              className='w-full bg-transparent border-none py-2 font-[family-name:var(--font-jost)] text-[0.85rem] text-palooza-ivory outline-none transition-colors duration-300 mb-4 placeholder:text-palooza-ivory/25 placeholder:text-[0.8rem]'
              style={{ borderBottom: '1px solid rgba(200, 168, 75, .3)' }}
              type='password'
              placeholder='Enter host password'
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
            />

            <label className='block text-[0.58rem] tracking-[0.22em] uppercase text-palooza-gold mb-[0.6rem] mt-[0.8rem]'>
              Post an update
            </label>
            <textarea
              className='w-full bg-transparent p-[0.8rem] font-[family-name:var(--font-jost)] text-[0.88rem] font-light text-palooza-ivory outline-none resize-y min-h-[80px] leading-[1.5] transition-colors duration-300 focus:border-palooza-gold placeholder:text-palooza-ivory/25'
              style={{ border: '1px solid rgba(200, 168, 75, .3)' }}
              placeholder='Write your update here — guests will see it immediately and receive a text notification when SMS is connected…'
              value={adminMsg}
              onChange={(e) => setAdminMsg(e.target.value)}
            />

            <div className='text-[0.72rem] text-palooza-sand leading-[1.6] mt-[0.8rem] opacity-70'>
              📱 SMS notifications to all guests will be enabled once the app is
              hosted. For now, updates appear in the feed instantly.
            </div>

            <button
              onClick={postUpdate}
              className='w-full bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.62rem] tracking-[0.25em] uppercase py-[0.8rem] cursor-pointer transition-all duration-300 mt-[0.8rem] hover:bg-palooza-gold hover:text-palooza-navy'
            >
              Post Update ↗
            </button>
            {adminError && (
              <div className='text-[0.7rem] text-palooza-flame mt-2 min-h-4'>
                {adminError}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
