'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DEFAULT_CONTENT } from '@/lib/content';
import type { RsvpEntry } from '../types';
import RsvpEditModal from './rsvp-edit-modal';

const EVENTS = [
  { key: 'soho', label: 'A Mi Manera — Thu' },
  { key: 'boats-fri', label: 'Boats + Cala Gracioneta — Fri' },
  { key: 'bluemarlin', label: 'Blue Marlin — Fri' },
  { key: 'boats-sat', label: 'Boats + Es Molí del Sal — Sat' },
  { key: 'villa', label: 'Private Villa Party — Sat' },
  { key: 'jondal', label: 'Jondal — Sun' },
];

interface DashboardPanelProps {
  rsvps: RsvpEntry[];
  onRefresh: (data: RsvpEntry[]) => void;
}

export default function DashboardPanel({
  rsvps,
  onRefresh,
}: DashboardPanelProps) {
  const [editing, setEditing] = useState<RsvpEntry | null>(null);
  const [creating, setCreating] = useState(false);
  // Inline per-card delete: which phone is awaiting confirmation / mid-delete
  const [confirmDeletePhone, setConfirmDeletePhone] = useState<string | null>(null);
  const [deletingPhone, setDeletingPhone] = useState<string | null>(null);
  // Event names & allergy options for the editor — pulled from the live CMS
  // content so they match exactly what guests see, with built-in fallbacks.
  const [eventOptions, setEventOptions] = useState(
    DEFAULT_CONTENT.rsvp.events.map((e) => ({ key: e.key, name: e.name })),
  );
  const [allergyOptions, setAllergyOptions] = useState<string[]>(
    DEFAULT_CONTENT.rsvp.allergyOptions,
  );

  useEffect(() => {
    api
      .get('/api/content')
      .then(({ data }) => {
        const r = data?.content?.rsvp;
        if (r?.events?.length) {
          setEventOptions(
            r.events.map((e: { key: string; name: string }) => ({
              key: e.key,
              name: e.name,
            })),
          );
        }
        if (r?.allergyOptions?.length) setAllergyOptions(r.allergyOptions);
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  function handleSaved(updated: RsvpEntry) {
    const exists = rsvps.some((r) => r.phone === updated.phone);
    onRefresh(
      exists
        ? rsvps.map((r) => (r.phone === updated.phone ? updated : r))
        : [updated, ...rsvps],
    );
    setEditing(null);
    setCreating(false);
  }

  async function deleteRsvp(phone: string) {
    const token = localStorage.getItem('palooza_admin_token');
    if (!token) return;
    setDeletingPhone(phone);
    try {
      await api.delete('/api/rsvps', {
        params: { phone },
        headers: { Authorization: `Bearer ${token}` },
      });
      onRefresh(rsvps.filter((r) => r.phone !== phone));
    } catch {
      /* leave the entry in place if deletion failed */
    } finally {
      setDeletingPhone(null);
      setConfirmDeletePhone(null);
    }
  }

  /* Compute stats */
  let guestsWithAllergies = 0;
  let totalYes = 0;
  const allergyCounts: Record<string, number> = {};

  rsvps.forEach((r) => {
    const allergies = r.allergies || [];
    const hasAllergy = allergies.length > 0 && !allergies.includes('None');
    if (hasAllergy) guestsWithAllergies++;
    allergies.forEach((a) => {
      if (a !== 'None') allergyCounts[a] = (allergyCounts[a] || 0) + 1;
    });
    if (r.rsvp) {
      totalYes += Object.values(r.rsvp).filter((v) => v === 'yes').length;
    }
  });

  async function handleRefresh() {
    try {
      const token = localStorage.getItem('palooza_admin_token') || '';
      const { data } = await api.get('/api/rsvps', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.rsvps) onRefresh(data.rsvps);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      {/* Actions */}
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={handleRefresh}
          className='inline-block text-[0.6rem] tracking-[0.2em] uppercase text-palooza-gold bg-transparent py-2 px-4 cursor-pointer font-[family-name:var(--font-jost)]'
          style={{ border: '1px solid rgba(200, 168, 75, .3)' }}
        >
          ↻ Refresh
        </button>
        <button
          onClick={() => setCreating(true)}
          className='inline-block text-[0.6rem] tracking-[0.2em] uppercase text-palooza-gold hover:text-palooza-navy hover:bg-palooza-gold bg-transparent py-2 px-4 cursor-pointer font-[family-name:var(--font-jost)] transition-colors duration-200'
          style={{ border: '1px solid rgba(200, 168, 75, .3)' }}
        >
          + Add RSVP
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div
          className='text-center p-[1.2rem]'
          style={{ border: '1px solid rgba(200, 168, 75, .2)' }}
        >
          <div className='font-[family-name:var(--font-cinzel)] text-[2rem] text-palooza-gold'>
            {rsvps.length}
          </div>
          <div className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-sand mt-[0.2rem]'>
            RSVPs received
          </div>
        </div>
        <div
          className='text-center p-[1.2rem]'
          style={{ border: '1px solid rgba(200, 168, 75, .2)' }}
        >
          <div className='font-[family-name:var(--font-cinzel)] text-[2rem] text-palooza-gold'>
            {guestsWithAllergies}
          </div>
          <div className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-sand mt-[0.2rem]'>
            With dietary needs
          </div>
        </div>
        <div
          className='text-center p-[1.2rem]'
          style={{ border: '1px solid rgba(200, 168, 75, .2)' }}
        >
          <div className='font-[family-name:var(--font-cinzel)] text-[2rem] text-palooza-gold'>
            {totalYes}
          </div>
          <div className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-sand mt-[0.2rem]'>
            Event confirmations
          </div>
        </div>
      </div>

      {/* Event Attendance */}
      <div
        className='font-[family-name:var(--font-cinzel)] text-[1.1rem] text-palooza-ivory mt-8 mb-4 pb-2'
        style={{ borderBottom: '1px solid rgba(200, 168, 75, .15)' }}
      >
        Event Attendance
      </div>
      <table className='w-full border-collapse text-[0.8rem]'>
        <thead>
          <tr>
            <th
              className='text-left py-2 px-3 text-[0.6rem] tracking-[0.18em] uppercase text-palooza-gold font-normal'
              style={{ borderBottom: '1px solid rgba(200, 168, 75, .2)' }}
            >
              Event
            </th>
            <th
              className='text-left py-2 px-3 text-[0.6rem] tracking-[0.18em] uppercase text-palooza-gold font-normal'
              style={{ borderBottom: '1px solid rgba(200, 168, 75, .2)' }}
            >
              ✓ Yes
            </th>
            <th
              className='text-left py-2 px-3 text-[0.6rem] tracking-[0.18em] uppercase text-palooza-gold font-normal'
              style={{ borderBottom: '1px solid rgba(200, 168, 75, .2)' }}
            >
              ✕ No
            </th>
            <th
              className='text-left py-2 px-3 text-[0.6rem] tracking-[0.18em] uppercase text-palooza-gold font-normal'
              style={{ borderBottom: '1px solid rgba(200, 168, 75, .2)' }}
            >
              Pending
            </th>
          </tr>
        </thead>
        <tbody>
          {EVENTS.map((ev) => {
            const yes = rsvps.filter(
              (r) => r.rsvp && r.rsvp[ev.key] === 'yes',
            ).length;
            const no = rsvps.filter(
              (r) => r.rsvp && r.rsvp[ev.key] === 'no',
            ).length;
            const pending = rsvps.length - yes - no;
            return (
              <tr key={ev.key}>
                <td
                  className='py-2 px-3 text-palooza-ivory'
                  style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
                >
                  {ev.label}
                </td>
                <td
                  className='py-2 px-3 text-[#5dba7d] font-medium'
                  style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
                >
                  {yes}
                </td>
                <td
                  className='py-2 px-3 text-[#e07070]'
                  style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
                >
                  {no}
                </td>
                <td
                  className='py-2 px-3 text-palooza-sand'
                  style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
                >
                  {pending > 0 ? pending : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Dietary Requirements Summary */}
      <div
        className='font-[family-name:var(--font-cinzel)] text-[1.1rem] text-palooza-ivory mt-8 mb-4 pb-2'
        style={{ borderBottom: '1px solid rgba(200, 168, 75, .15)' }}
      >
        Dietary Requirements Summary
      </div>
      <div className='flex flex-wrap gap-2'>
        {Object.keys(allergyCounts).length === 0 ? (
          <div className='text-palooza-ivory/30 text-[0.75rem] italic'>
            No dietary requirements submitted yet
          </div>
        ) : (
          Object.entries(allergyCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => (
              <div
                key={name}
                className='flex items-center gap-[0.6rem] py-2 px-4'
                style={{ border: '1px solid rgba(200, 168, 75, .2)' }}
              >
                <div className='font-[family-name:var(--font-cinzel)] text-[1.1rem] text-palooza-gold'>
                  {count}
                </div>
                <div className='text-[0.75rem] text-palooza-sand'>{name}</div>
              </div>
            ))
        )}
      </div>

      {/* Individual RSVPs */}
      <div
        className='font-[family-name:var(--font-cinzel)] text-[1.1rem] text-palooza-ivory mt-8 mb-4 pb-2'
        style={{ borderBottom: '1px solid rgba(200, 168, 75, .15)' }}
      >
        Individual RSVPs
      </div>
      <div className='flex flex-col gap-[0.8rem]'>
        {rsvps.length === 0 ? (
          <div className='text-center py-12 italic text-palooza-ivory/30'>
            No RSVPs yet — check back soon
          </div>
        ) : (
          rsvps.map((r, i) => {
            const allergies = (r.allergies || []).filter((a) => a !== 'None');
            const date = r.submittedAt
              ? new Date(r.submittedAt).toLocaleString('en-GB')
              : '';

            return (
              <div
                key={i}
                className='p-[1.2rem]'
                style={{
                  border: '1px solid rgba(200, 168, 75, .15)',
                  background: 'rgba(255,255,255,.02)',
                }}
              >
                <div className='flex items-start justify-between gap-3 mb-[0.3rem]'>
                  <div className='font-[family-name:var(--font-cinzel)] text-base text-palooza-ivory'>
                    {r.name || 'Unknown'}
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    {confirmDeletePhone === r.phone ? (
                      <>
                        <span className='text-[0.55rem] tracking-[0.1em] uppercase text-palooza-flame'>
                          Delete?
                        </span>
                        <button
                          onClick={() => r.phone && deleteRsvp(r.phone)}
                          disabled={deletingPhone === r.phone}
                          className='text-[0.55rem] tracking-[0.18em] uppercase text-white bg-palooza-flame px-3 py-1 transition-opacity duration-200 disabled:opacity-50'
                        >
                          {deletingPhone === r.phone ? '…' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmDeletePhone(null)}
                          disabled={deletingPhone === r.phone}
                          className='text-[0.55rem] tracking-[0.18em] uppercase text-palooza-ivory/40 hover:text-palooza-ivory/70 transition-colors duration-200 px-2 py-1'
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing(r)}
                          className='text-[0.55rem] tracking-[0.18em] uppercase text-palooza-gold/70 hover:text-palooza-navy hover:bg-palooza-gold transition-colors duration-200 font-[family-name:var(--font-jost)] px-3 py-1'
                          style={{ border: '1px solid rgba(200, 168, 75, .3)' }}
                        >
                          Edit ✎
                        </button>
                        <button
                          onClick={() => setConfirmDeletePhone(r.phone || null)}
                          className='text-[0.55rem] tracking-[0.18em] uppercase text-palooza-flame/70 hover:text-palooza-navy hover:bg-palooza-flame transition-colors duration-200 font-[family-name:var(--font-jost)] px-3 py-1'
                          style={{ border: '1px solid rgba(192, 57, 43, .4)' }}
                        >
                          Delete ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className='text-[0.7rem] text-palooza-gold tracking-[0.1em] mb-[0.8rem]'>
                  {r.phone || ''}
                </div>

                {/* Event responses */}
                <div className='grid grid-cols-2 gap-[0.3rem] mb-[0.8rem]'>
                  {EVENTS.map((ev) => {
                    const ans = r.rsvp && r.rsvp[ev.key];
                    const cls =
                      ans === 'yes'
                        ? 'bg-[rgba(30,132,73,.15)] text-[#5dba7d]'
                        : ans === 'no'
                          ? 'bg-[rgba(192,57,43,.1)] text-[#e07070]'
                          : 'bg-[rgba(200,168,75,.08)] text-palooza-gold/50';
                    const label =
                      ans === 'yes' ? '✓' : ans === 'no' ? '✕' : '?';
                    return (
                      <div
                        key={ev.key}
                        className={`flex justify-between items-center text-[0.75rem] py-1 px-2 rounded-sm ${cls}`}
                      >
                        <span className='text-palooza-sand'>
                          {ev.label.split('—')[0].trim()}
                        </span>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Allergies */}
                <div className='mt-2'>
                  {allergies.length > 0 ? (
                    allergies.map((a) => (
                      <span
                        key={a}
                        className='inline-block text-[0.65rem] py-[0.2rem] px-[0.6rem] text-palooza-gold mr-1 mb-1 rounded-sm'
                        style={{
                          background: 'rgba(200, 168, 75, .1)',
                          border: '1px solid rgba(200, 168, 75, .25)',
                        }}
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className='text-palooza-ivory/30 text-[0.75rem] italic'>
                      None
                    </span>
                  )}
                  {r.other && (
                    <div className='text-[0.78rem] text-palooza-sand mt-[0.3rem] italic'>
                      &quot;{r.other}&quot;
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className='text-[0.6rem] text-palooza-ivory/25 mt-2'>
                  {date}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Host RSVP editor */}
      {editing && (
        <RsvpEditModal
          mode='edit'
          entry={editing}
          events={eventOptions}
          allergyOptions={allergyOptions}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Host creating a new RSVP on a guest's behalf */}
      {creating && (
        <RsvpEditModal
          mode='create'
          events={eventOptions}
          allergyOptions={allergyOptions}
          onClose={() => setCreating(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
