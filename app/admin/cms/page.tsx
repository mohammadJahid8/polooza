'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import VideoUpload from '@/app/admin/_components/video-upload';
import {
  DEFAULT_CONTENT,
  type SiteContent,
  type DayContent,
  type DjEntry,
  type TransportItem,
  type NtkItem,
  type ChapterItem,
  type RsvpEvent,
} from '@/lib/content';

// ── Tiny shared input components ─────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    'w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.85rem] text-palooza-ivory outline-none placeholder:text-palooza-ivory/20 py-[0.5rem]';
  const style = { borderBottom: '1px solid rgba(200,168,75,.3)' };
  return (
    <div className='flex flex-col gap-1 mb-4'>
      <label className='text-[0.55rem] tracking-[0.2em] uppercase text-palooza-gold/70'>
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${cls} resize-y min-h-[60px]`}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          style={style}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className='mb-10 p-6'
      style={{
        border: '1px solid rgba(200,168,75,.15)',
        background: 'rgba(200,168,75,.03)',
      }}
    >
      <div className='text-[0.6rem] tracking-[0.25em] uppercase text-palooza-gold mb-5'>
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCmsPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    const token = localStorage.getItem('palooza_admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    try {
      const { data } = await api.get('/api/content');
      if (data?.content) setContent({ ...DEFAULT_CONTENT, ...data.content });
    } catch {
      /* use defaults */
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    const token = localStorage.getItem('palooza_admin_token');
    if (!token) return;
    setSaving(true);
    try {
      await api.put('/api/content', content, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('✓ Saved successfully');
    } catch {
      showToast('✗ Save failed — check your connection');
    } finally {
      setSaving(false);
    }
  }

  // ── Update helpers ──────────────────────────────────────────────────────────
  function setHero(key: keyof SiteContent['hero'], val: string) {
    setContent((c) => ({ ...c, hero: { ...c.hero, [key]: val } }));
  }
  function setSchedule(key: keyof SiteContent['schedule'], val: unknown) {
    setContent((c) => ({ ...c, schedule: { ...c.schedule, [key]: val } }));
  }
  function updateDay(di: number, key: keyof DayContent, val: unknown) {
    setContent((c) => {
      const days = [...c.schedule.days];
      days[di] = { ...days[di], [key]: val };
      return { ...c, schedule: { ...c.schedule, days } };
    });
  }
  function updateDayTimeline(di: number, ti: number, key: string, val: string) {
    setContent((c) => {
      const days = [...c.schedule.days];
      const tl = [...days[di].timeline];
      tl[ti] = { ...tl[ti], [key]: val };
      days[di] = { ...days[di], timeline: tl };
      return { ...c, schedule: { ...c.schedule, days } };
    });
  }
  function updateDj(i: number, key: keyof DjEntry, val: string) {
    setContent((c) => {
      const djs = [...c.music.djs];
      djs[i] = { ...djs[i], [key]: val };
      return { ...c, music: { djs } };
    });
  }
  function updateTransport(i: number, key: keyof TransportItem, val: string) {
    setContent((c) => {
      const items = [...c.transport.items];
      items[i] = { ...items[i], [key]: val };
      return { ...c, transport: { ...c.transport, items } };
    });
  }
  function updateNtk(i: number, key: keyof NtkItem, val: string) {
    setContent((c) => {
      const items = [...c.needToKnow.items];
      items[i] = { ...items[i], [key]: val };
      return { ...c, needToKnow: { items } };
    });
  }
  function updateChapter(i: number, key: keyof ChapterItem, val: string) {
    setContent((c) => {
      const items = [...c.chapters.items];
      items[i] = { ...items[i], [key]: val };
      return { ...c, chapters: { ...c.chapters, items } };
    });
  }
  function setChapters(key: keyof SiteContent['chapters'], val: unknown) {
    setContent((c) => ({ ...c, chapters: { ...c.chapters, [key]: val } }));
  }
  function updateRsvpEvent(i: number, key: keyof RsvpEvent, val: string) {
    setContent((c) => {
      const events = [...c.rsvp.events];
      events[i] = { ...events[i], [key]: val };
      return { ...c, rsvp: { ...c.rsvp, events } };
    });
  }
  function setRsvp(key: keyof SiteContent['rsvp'], val: unknown) {
    setContent((c) => ({ ...c, rsvp: { ...c.rsvp, [key]: val } }));
  }

  return (
    <div className='max-w-[720px] mx-auto pb-24'>
      {/* Breadcrumb */}
      <div className='flex items-center justify-between mb-8'>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-ivory/30 hover:text-palooza-gold transition-colors font-[family-name:var(--font-jost)]'
        >
          ← Dashboard
        </button>
        <div className='text-[0.55rem] tracking-[0.25em] uppercase text-palooza-gold'>
          Content Editor
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Card title='Hero Section'>
        <Field
          label='Tag line'
          value={content.hero.tag}
          onChange={(v) => setHero('tag', v)}
        />
        <Field
          label='Title'
          value={content.hero.title}
          onChange={(v) => setHero('title', v)}
        />
        <Field
          label='Subtitle'
          value={content.hero.subtitle}
          onChange={(v) => setHero('subtitle', v)}
        />
        <Field
          label='Dates'
          value={content.hero.dates}
          onChange={(v) => setHero('dates', v)}
        />
      </Card>

      {/* ── SCHEDULE ─────────────────────────────────────────────────────── */}
      <Card title='Schedule — Notice Banner'>
        <Field
          label='Banner text (after "Private event.")'
          value={content.schedule.noticeBanner}
          onChange={(v) => setSchedule('noticeBanner', v)}
          multiline
        />
      </Card>

      {content.schedule.days.map((day, di) => (
        <Card key={day.element} title={`Schedule · ${day.name}`}>
          <Field
            label='Day name'
            value={day.name}
            onChange={(v) => updateDay(di, 'name', v)}
          />
          <Field
            label='Date label'
            value={day.date}
            onChange={(v) => updateDay(di, 'date', v)}
          />
          <Field
            label='Tab label'
            value={day.tabLabel}
            onChange={(v) => updateDay(di, 'tabLabel', v)}
          />
          <Field
            label='Photo venue'
            value={day.photo.venue}
            onChange={(v) => updateDay(di, 'photo', { ...day.photo, venue: v })}
          />
          <Field
            label='Photo time'
            value={day.photo.time}
            onChange={(v) => updateDay(di, 'photo', { ...day.photo, time: v })}
          />
          <VideoUpload
            label={`${day.name} — Video`}
            value={day.video}
            folder={`palooza/schedule-videos/${day.element}`}
            onChange={(url) => updateDay(di, 'video', url)}
          />
          <div className='mt-2 mb-1 text-[0.55rem] tracking-[0.2em] uppercase text-palooza-sand/50'>
            Timeline items
          </div>
          {day.timeline.map((tl, ti) => (
            <div
              key={ti}
              className='pl-3 mb-3'
              style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
            >
              <Field
                label={`Item ${ti + 1} — Time`}
                value={tl.time}
                onChange={(v) => updateDayTimeline(di, ti, 'time', v)}
              />
              <Field
                label={`Item ${ti + 1} — Event`}
                value={tl.event}
                onChange={(v) => updateDayTimeline(di, ti, 'event', v)}
              />
              <Field
                label={`Item ${ti + 1} — Note`}
                value={tl.note}
                onChange={(v) => updateDayTimeline(di, ti, 'note', v)}
              />
            </div>
          ))}
        </Card>
      ))}

      {/* ── MUSIC ────────────────────────────────────────────────────────── */}
      <Card title='Music — DJ Lineup'>
        {content.music.djs.map((dj, i) => (
          <div
            key={i}
            className='mb-4 pl-3'
            style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
          >
            <Field
              label={`DJ ${i + 1} — Time slot`}
              value={dj.time}
              onChange={(v) => updateDj(i, 'time', v)}
            />
            <Field
              label={`DJ ${i + 1} — Name`}
              value={dj.name}
              onChange={(v) => updateDj(i, 'name', v)}
            />
            <Field
              label={`DJ ${i + 1} — Genre/info`}
              value={dj.genre}
              onChange={(v) => updateDj(i, 'genre', v)}
            />
            <Field
              label={`DJ ${i + 1} — Tag`}
              value={dj.tag}
              onChange={(v) => updateDj(i, 'tag', v)}
            />
          </div>
        ))}
      </Card>

      {/* ── TRANSPORT ────────────────────────────────────────────────────── */}
      <Card title='Transport — Warning Banner'>
        <Field
          label='Warning text'
          value={content.transport.warningBanner}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              transport: { ...c.transport, warningBanner: v },
            }))
          }
          multiline
        />
      </Card>
      <Card title='Transport — Cards'>
        {content.transport.items.map((item, i) => (
          <div
            key={i}
            className='mb-4 pl-3'
            style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
          >
            <Field
              label={`Card ${i + 1} — Icon emoji`}
              value={item.icon}
              onChange={(v) => updateTransport(i, 'icon', v)}
            />
            <Field
              label={`Card ${i + 1} — Type`}
              value={item.type}
              onChange={(v) => updateTransport(i, 'type', v)}
            />
            <Field
              label={`Card ${i + 1} — Detail (use \\n for line breaks)`}
              value={item.detail}
              onChange={(v) => updateTransport(i, 'detail', v)}
              multiline
            />
          </div>
        ))}
      </Card>

      {/* ── NEED TO KNOW ─────────────────────────────────────────────────── */}
      <Card title='Need to Know — Items'>
        {content.needToKnow.items.map((item, i) => (
          <div
            key={i}
            className='mb-4 pl-3'
            style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
          >
            <Field
              label={`Item ${i + 1} — Icon emoji`}
              value={item.icon}
              onChange={(v) => updateNtk(i, 'icon', v)}
            />
            <Field
              label={`Item ${i + 1} — Title`}
              value={item.title}
              onChange={(v) => updateNtk(i, 'title', v)}
            />
            <Field
              label={`Item ${i + 1} — Detail`}
              value={item.detail}
              onChange={(v) => updateNtk(i, 'detail', v)}
              multiline
            />
          </div>
        ))}
      </Card>

      {/* ── CHAPTERS ─────────────────────────────────────────────────────── */}
      <Card title='Chapters — Past Events'>
        {content.chapters.items.map((ch, i) => (
          <div
            key={i}
            className='mb-3 pl-3'
            style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
          >
            <Field
              label={`Chapter ${ch.num} — Location`}
              value={ch.location}
              onChange={(v) => updateChapter(i, 'location', v)}
            />
            <Field
              label={`Chapter ${ch.num} — Title`}
              value={ch.title}
              onChange={(v) => updateChapter(i, 'title', v)}
            />
          </div>
        ))}
      </Card>
      <Card title='Chapters — Current Chapter Box'>
        <Field
          label='Label'
          value={content.chapters.currentLabel}
          onChange={(v) => setChapters('currentLabel', v)}
        />
        <Field
          label='Title'
          value={content.chapters.currentTitle}
          onChange={(v) => setChapters('currentTitle', v)}
        />
        <Field
          label='Subtitle'
          value={content.chapters.currentSub}
          onChange={(v) => setChapters('currentSub', v)}
          multiline
        />
      </Card>

      {/* ── RSVP ──────────────────────────────────────────────────────────── */}
      <Card title='RSVP — Intro Text'>
        <Field
          label='Intro paragraph'
          value={content.rsvp.introText}
          onChange={(v) => setRsvp('introText', v)}
          multiline
        />
      </Card>
      <Card title='RSVP — Events'>
        {content.rsvp.events.map((ev, i) => (
          <div
            key={ev.key}
            className='mb-4 pl-3'
            style={{ borderLeft: '1px solid rgba(200,168,75,.15)' }}
          >
            <Field
              label={`Event ${i + 1} — Name`}
              value={ev.name}
              onChange={(v) => updateRsvpEvent(i, 'name', v)}
            />
            <Field
              label={`Event ${i + 1} — Detail`}
              value={ev.detail}
              onChange={(v) => updateRsvpEvent(i, 'detail', v)}
            />
          </div>
        ))}
      </Card>
      <Card title='RSVP — Allergy Options'>
        <div className='text-[0.62rem] text-palooza-sand/60 mb-3 leading-[1.5]'>
          Comma-separated list of options shown as pill buttons
        </div>
        <Field
          label='Options (comma-separated)'
          value={content.rsvp.allergyOptions.join(', ')}
          onChange={(v) =>
            setRsvp(
              'allergyOptions',
              v
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          multiline
        />
      </Card>
      <Card title='RSVP — Success Screen'>
        <Field
          label='Confirmed title'
          value={content.rsvp.successTitle}
          onChange={(v) => setRsvp('successTitle', v)}
        />
        <Field
          label='Confirmed text'
          value={content.rsvp.successText}
          onChange={(v) => setRsvp('successText', v)}
          multiline
        />
      </Card>

      {/* ── Save button ───────────────────────────────────────────────────── */}
      <div
        className='fixed bottom-0 left-0 right-0 px-6 py-4 z-50'
        style={{
          background: 'rgba(4,12,22,.95)',
          borderTop: '1px solid rgba(200,168,75,.15)',
        }}
      >
        <div className='max-w-[720px] mx-auto flex items-center justify-between gap-4'>
          {toast ? (
            <span className='text-[0.7rem] tracking-[0.1em] text-palooza-gold'>
              {toast}
            </span>
          ) : (
            <span className='text-[0.65rem] tracking-[0.1em] text-palooza-ivory/25'>
              Changes are saved to the live site immediately
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className='bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.62rem] tracking-[0.25em] uppercase py-[0.7rem] px-6 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy disabled:opacity-50 shrink-0'
          >
            {saving ? 'Saving…' : 'Save All Changes ↗'}
          </button>
        </div>
      </div>
    </div>
  );
}
