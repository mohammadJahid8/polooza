'use client';

import { useState } from 'react';
import api from '@/lib/api';
import type { RsvpEntry } from '../types';

interface EventOption {
  key: string;
  name: string;
}

interface Props {
  /** 'edit' amends an existing RSVP; 'create' adds a new one on a guest's behalf */
  mode: 'create' | 'edit';
  /** The RSVP being edited — omitted in create mode */
  entry?: RsvpEntry;
  events: EventOption[];
  allergyOptions: string[];
  onClose: () => void;
  onSaved: (updated: RsvpEntry) => void;
}

export default function RsvpEditModal({
  mode,
  entry,
  events,
  allergyOptions,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(entry?.name || '');
  const [phone, setPhone] = useState(entry?.phone || '');
  const [rsvpState, setRsvpState] = useState<Record<string, string>>({
    ...(entry?.rsvp || {}),
  });
  const [allergies, setAllergies] = useState<Set<string>>(
    new Set(entry?.allergies || []),
  );
  const [other, setOther] = useState(entry?.other || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function setAnswer(key: string, answer: 'yes' | 'no') {
    setRsvpState((prev) => {
      const next = { ...prev };
      if (next[key] === answer)
        delete next[key]; // tap again → back to pending
      else next[key] = answer;
      return next;
    });
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

  async function save() {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (mode === 'create' && !phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    const token = localStorage.getItem('palooza_admin_token');
    if (!token) {
      setError('Session expired — please sign in again.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      phone: mode === 'create' ? phone.trim() : entry!.phone,
      name: name.trim(),
      rsvp: rsvpState,
      allergies: [...allergies],
      other: other.trim(),
    };
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const { data } =
        mode === 'create'
          ? await api.post('/api/rsvps/admin', payload, { headers })
          : await api.put('/api/rsvps', payload, { headers });
      onSaved(data.rsvp as RsvpEntry);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Failed to save. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }


  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      style={{ background: 'rgba(4,12,22,.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className='w-full max-w-[560px] max-h-[88vh] overflow-y-auto p-6'
        style={{
          border: '1px solid rgba(200,168,75,.25)',
          background: 'rgba(6,15,26,.98)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-start justify-between mb-5'>
          <div>
            <div className='text-[0.55rem] tracking-[0.25em] uppercase text-palooza-gold mb-1'>
              {mode === 'create' ? 'New RSVP' : 'Edit RSVP'}
            </div>
            {mode === 'edit' && (
              <div className='text-[0.7rem] text-palooza-gold/70 tracking-[0.1em]'>
                {entry?.phone}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className='text-palooza-ivory/40 hover:text-palooza-flame transition-colors text-lg leading-none'
            aria-label='Close'
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <div className='flex flex-col gap-1 mb-5'>
          <label className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70'>
            Name
          </label>
          <input
            className='w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.9rem] text-palooza-ivory outline-none py-[0.5rem]'
            style={{ borderBottom: '1px solid rgba(200,168,75,.3)' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Phone — editable only when creating a new RSVP */}
        {mode === 'create' && (
          <div className='flex flex-col gap-1 mb-5'>
            <label className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70'>
              Phone number
            </label>
            <input
              className='w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.9rem] text-palooza-ivory outline-none py-[0.5rem] placeholder:text-palooza-ivory/25'
              style={{ borderBottom: '1px solid rgba(200,168,75,.3)' }}
              placeholder='e.g. +447700900000'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <span className='text-[0.58rem] text-palooza-ivory/30 italic mt-1'>
              Use the same number the guest will sign in with.
            </span>
          </div>
        )}

        {/* Event responses */}
        <div className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70 mb-2'>
          Event responses
        </div>
        <div className='text-[0.6rem] text-palooza-ivory/30 italic mb-3'>
          Tap a selected answer again to reset it to pending.
        </div>
        <div className='flex flex-col gap-2 mb-6'>
          {events.map((ev) => {
            const answer = rsvpState[ev.key];
            return (
              <div
                key={ev.key}
                className='flex items-center justify-between gap-3 py-[0.5rem] px-3 rounded-sm'
                style={{
                  border: '1px solid rgba(200,168,75,.12)',
                  background: 'rgba(255,255,255,.02)',
                }}
              >
                <span className='text-[0.8rem] text-palooza-ivory'>
                  {ev.name}
                </span>
                <div className='flex gap-2 shrink-0'>
                  <button
                    onClick={() => setAnswer(ev.key, 'yes')}
                    className={`text-[0.58rem] tracking-[0.12em] uppercase py-[0.35rem] px-[0.7rem] cursor-pointer transition-all duration-200 ${
                      answer === 'yes'
                        ? 'bg-palooza-green text-white'
                        : 'bg-transparent text-[rgba(30,132,73,.85)]'
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
                    onClick={() => setAnswer(ev.key, 'no')}
                    className={`text-[0.58rem] tracking-[0.12em] uppercase py-[0.35rem] px-[0.7rem] cursor-pointer transition-all duration-200 ${
                      answer === 'no'
                        ? 'bg-palooza-flame text-white'
                        : 'bg-transparent text-[rgba(192,57,43,.75)]'
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
            );
          })}
        </div>

        {/* Allergies */}
        <div className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70 mb-2'>
          Dietary requirements
        </div>
        <div className='flex flex-wrap gap-2 mb-3'>
          {allergyOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleAllergy(opt)}
              className={`text-[0.68rem] tracking-[0.08em] py-[0.35rem] px-[0.75rem] cursor-pointer transition-all duration-200 bg-transparent ${
                allergies.has(opt) ? 'text-palooza-gold' : 'text-palooza-sand'
              }`}
              style={{
                border: allergies.has(opt)
                  ? '1px solid #C8A84B'
                  : '1px solid rgba(200,168,75,.25)',
                background: allergies.has(opt)
                  ? 'rgba(200,168,75,.15)'
                  : 'transparent',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <input
          className='w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.82rem] text-palooza-ivory outline-none py-[0.5rem] mb-6 placeholder:text-palooza-ivory/25'
          style={{ borderBottom: '1px solid rgba(200,168,75,.3)' }}
          placeholder='Other notes / details…'
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />

        {/* Error */}
        {error && (
          <div className='text-[0.7rem] text-palooza-flame mb-3'>{error}</div>
        )}

        {/* Actions */}
        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={onClose}
            className='text-[0.6rem] tracking-[0.2em] uppercase text-palooza-ivory/40 hover:text-palooza-ivory/70 transition-colors py-[0.6rem] px-4'
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className='bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.22em] uppercase py-[0.6rem] px-6 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50'
          >
            {saving
              ? 'Saving…'
              : mode === 'create'
                ? 'Create RSVP ↗'
                : 'Save changes ↗'}
          </button>
        </div>
      </div>
    </div>
  );
}
