'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Guest {
  _id: string;
  name: string;
  phone: string;
  country: string;
}

/* ── Tiny shared UI ─────────────────────────────────────────────────────────── */

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-[0.5rem] tracking-[0.2em] uppercase text-palooza-gold/70'>{label}</label>
      <input
        className='w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.82rem] text-palooza-ivory outline-none placeholder:text-palooza-ivory/20 py-[0.45rem]'
        style={{ borderBottom: '1px solid rgba(200,168,75,.3)' }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────────── */

export default function AdminGuestsPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  // New guest form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCountry, setNewCountry] = useState('');

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');

  // UI state
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('palooza_admin_token') : null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchGuests = useCallback(async () => {
    if (!token) { router.replace('/admin/login'); return; }
    try {
      const { data } = await api.get('/api/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(data.guests || []);
    } catch {
      localStorage.removeItem('palooza_admin_token');
      router.replace('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  /* ── Add ──────────────────────────────────────────────────────────────────── */
  async function handleAdd() {
    if (!newName.trim() || !newPhone.trim()) {
      showToast('✗ Name and phone are required');
      return;
    }
    try {
      const { data } = await api.post('/api/guests', {
        name: newName.trim(),
        phone: newPhone.trim(),
        country: newCountry.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setGuests(prev => [...prev, data.guest].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(''); setNewPhone(''); setNewCountry('');
      showToast(`✓ ${data.guest.name} added`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to add guest';
      showToast(`✗ ${msg}`);
    }
  }

  /* ── Update ──────────────────────────────────────────────────────────────── */
  function startEdit(g: Guest) {
    setEditId(g._id);
    setEditName(g.name);
    setEditPhone(g.phone);
    setEditCountry(g.country || '');
  }

  async function saveEdit() {
    if (!editId) return;
    try {
      const { data } = await api.put(`/api/guests/${editId}`, {
        name: editName.trim(),
        phone: editPhone.trim(),
        country: editCountry.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setGuests(prev => prev.map(g => g._id === editId ? data.guest : g).sort((a, b) => a.name.localeCompare(b.name)));
      setEditId(null);
      showToast('✓ Guest updated');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to update';
      showToast(`✗ ${msg}`);
    }
  }

  /* ── Delete ──────────────────────────────────────────────────────────────── */
  async function handleDelete(id: string) {
    try {
      await api.delete(`/api/guests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(prev => prev.filter(g => g._id !== id));
      setConfirmDeleteId(null);
      showToast('✓ Guest removed');
    } catch {
      showToast('✗ Failed to remove guest');
    }
  }

  /* ── Filter ──────────────────────────────────────────────────────────────── */
  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search) ||
    (g.country || '').toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div className='max-w-[720px] mx-auto pb-24'>
      {/* Breadcrumb + count */}
      <div className='flex items-center justify-between mb-8'>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className='text-[0.6rem] tracking-[0.18em] uppercase text-palooza-ivory/30 hover:text-palooza-gold transition-colors font-[family-name:var(--font-jost)]'
        >
          ← Dashboard
        </button>
        <div className='text-[0.55rem] tracking-[0.25em] uppercase text-palooza-gold'>
          Guest List · {guests.length}
        </div>
      </div>

      {/* ── ADD NEW GUEST ────────────────────────────────────────────────────── */}
      <div
        className='mb-10 p-6'
        style={{ border: '1px solid rgba(200,168,75,.15)', background: 'rgba(200,168,75,.03)' }}
      >
        <div className='text-[0.6rem] tracking-[0.25em] uppercase text-palooza-gold mb-5'>
          Add New Guest
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5'>
          <Field label='Name' value={newName} onChange={setNewName} placeholder='Full name' />
          <Field label='Phone' value={newPhone} onChange={setNewPhone} placeholder='+44...' />
          <Field label='Country' value={newCountry} onChange={setNewCountry} placeholder='UK' />
        </div>
        <button
          onClick={handleAdd}
          className='bg-transparent border border-palooza-gold text-palooza-gold font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.25em] uppercase py-[0.6rem] px-5 cursor-pointer transition-all duration-300 hover:bg-palooza-gold hover:text-palooza-navy'
        >
          + Add Guest
        </button>
      </div>

      {/* ── SEARCH ───────────────────────────────────────────────────────────── */}
      <div className='mb-6'>
        <input
          className='w-full bg-transparent font-[family-name:var(--font-jost)] text-[0.85rem] text-palooza-ivory outline-none placeholder:text-palooza-ivory/20 py-[0.6rem] px-0'
          style={{ borderBottom: '1px solid rgba(200,168,75,.2)' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search by name, phone, or country…'
        />
      </div>

      {/* ── GUEST LIST ───────────────────────────────────────────────────────── */}
      <div className='flex flex-col gap-0'>
        {filtered.map(g => (
          <div
            key={g._id}
            className='py-[1rem] px-[0.4rem] transition-colors duration-150 hover:bg-palooza-gold/[0.03]'
            style={{ borderBottom: '1px solid rgba(200,168,75,.08)' }}
          >
            {editId === g._id ? (
              /* ── Inline edit mode ── */
              <div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
                  <Field label='Name' value={editName} onChange={setEditName} />
                  <Field label='Phone' value={editPhone} onChange={setEditPhone} />
                  <Field label='Country' value={editCountry} onChange={setEditCountry} />
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={saveEdit}
                    className='text-[0.55rem] tracking-[0.18em] uppercase text-palooza-gold hover:text-palooza-ivory transition-colors font-[family-name:var(--font-jost)]'
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className='text-[0.55rem] tracking-[0.18em] uppercase text-palooza-ivory/30 hover:text-palooza-ivory transition-colors font-[family-name:var(--font-jost)]'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── Display mode ── */
              <div className='flex items-center justify-between gap-4'>
                <div className='min-w-0'>
                  <div className='font-[family-name:var(--font-cinzel)] text-[0.85rem] text-palooza-ivory tracking-[0.03em] truncate'>
                    {g.name}
                  </div>
                  <div className='text-[0.65rem] text-palooza-sand/60 mt-[0.15rem] font-[family-name:var(--font-jost)]'>
                    {g.phone}
                    {g.country && <span className='ml-2 text-palooza-gold/40'>· {g.country}</span>}
                  </div>
                </div>
                <div className='flex items-center gap-3 shrink-0'>
                  <button
                    onClick={() => startEdit(g)}
                    className='text-[0.5rem] tracking-[0.15em] uppercase text-palooza-gold/50 hover:text-palooza-gold transition-colors font-[family-name:var(--font-jost)]'
                  >
                    Edit
                  </button>
                  {confirmDeleteId === g._id ? (
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleDelete(g._id)}
                        className='text-[0.5rem] tracking-[0.15em] uppercase text-palooza-flame hover:text-red-400 transition-colors font-[family-name:var(--font-jost)]'
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className='text-[0.5rem] tracking-[0.15em] uppercase text-palooza-ivory/30 hover:text-palooza-ivory transition-colors font-[family-name:var(--font-jost)]'
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(g._id)}
                      className='text-[0.5rem] tracking-[0.15em] uppercase text-palooza-ivory/20 hover:text-palooza-flame transition-colors font-[family-name:var(--font-jost)]'
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className='text-center py-12 text-[0.75rem] text-palooza-sand/40 font-[family-name:var(--font-jost)]'>
            {search ? 'No guests match your search' : 'No guests yet'}
          </div>
        )}
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-[0.7rem] tracking-[0.1em] text-palooza-gold'
          style={{ background: 'rgba(4,12,22,.95)', border: '1px solid rgba(200,168,75,.25)' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
