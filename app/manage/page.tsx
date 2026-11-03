'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Users,
  Search,
  MessageCircle,
  LogOut,
} from 'lucide-react';

type GuestRow = {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  created_at: string;
};

export default function GuestManagerPage() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [origin, setOrigin] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const savedPassword = sessionStorage.getItem('guest-manager-password');
    if (savedPassword) {
      setManagerPassword(savedPassword);
      setAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/guests', {
        headers: { Authorization: `Bearer ${managerPassword}` },
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('guest-manager-password');
          setAuthenticated(false);
          setManagerPassword('');
        }
        throw new Error(result.error ?? 'Unable to load guests.');
      }
      setGuests(result as GuestRow[]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load guests.');
    } finally {
      setLoading(false);
    }
  }, [managerPassword]);

  useEffect(() => {
    if (authenticated && managerPassword) fetchGuests();
  }, [authenticated, fetchGuests, managerPassword]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    setAuthLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/guests', {
        headers: { Authorization: `Bearer ${passwordInput}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? 'Unable to access the guest manager.');
      }
      sessionStorage.setItem('guest-manager-password', passwordInput);
      setManagerPassword(passwordInput);
      setGuests(result as GuestRow[]);
      setAuthenticated(true);
      setPasswordInput('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to access the guest manager.');
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('guest-manager-password');
    setManagerPassword('');
    setAuthenticated(false);
    setGuests([]);
    setError(null);
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${managerPassword}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), address: address.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to add this guest.');
      setName('');
      setAddress('');
      await fetchGuests();
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : 'Unable to add this guest.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteGuest = async (id: string) => {
    setError(null);
    try {
      const guest = guests.find((entry) => entry.id === id);
      if (!guest) throw new Error('Guest not found in the current list.');
      const response = await fetch(`/api/guests/${encodeURIComponent(guest.slug)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${managerPassword}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to delete this guest.');
      await fetchGuests();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this guest.');
    }
  };

  const copyLink = async (slug: string) => {
    const url = `${origin}/invite/${encodeURIComponent(slug)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      setError('Could not copy the link. Check browser clipboard permissions and try again.');
    }
  };

  const filtered = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.address ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivory via-blush/30 to-ivory px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-script text-3xl text-rose-gold">Kislay &amp; Sakshi</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            Guest Manager
          </h1>
          <p className="mt-3 text-sm text-burgundy/60">
            Add a guest name and address, then copy their personalized invitation link to send.
          </p>
        </div>

        {!authenticated ? (
          <div className="glass mx-auto max-w-md rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-burgundy">Manager access</h2>
            <p className="mt-2 text-sm text-burgundy/60">
              Enter the guest manager password configured for this app.
            </p>
            <form onSubmit={login} className="mt-5 space-y-4">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Manager password"
                className="w-full rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
              />
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={authLoading}
                className="btn-luxe flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-[0.15em] disabled:opacity-50"
              >
                {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Unlock Guest Manager
              </button>
            </form>
          </div>
        ) : (
          <>
        {error && (
          <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-white/70 px-4 py-2 text-xs font-semibold text-burgundy"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        {/* Add form */}
        <div className="glass mb-8 rounded-2xl p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-burgundy">
            <Plus className="h-5 w-5 text-rose-gold" />
            <h2 className="font-display text-xl font-semibold">Add a Guest</h2>
          </div>
          <form onSubmit={addGuest} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                Guest Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mr. & Mrs. Rahul Patel"
                className="w-full rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                Address (optional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. B-204, Green Acres, Ahmedabad, Gujarat"
                className="w-full rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
              />
            </div>
            <motion.button
              type="submit"
              disabled={submitting || !name.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-luxe flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-[0.15em] disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Guest &amp; Generate Link
            </motion.button>
          </form>
        </div>

        {/* Guest list */}
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-burgundy">
              <Users className="h-5 w-5 text-rose-gold" />
              <h2 className="font-display text-xl font-semibold">Guest List</h2>
              <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-xs font-semibold text-burgundy">
                {guests.length}
              </span>
            </div>
          </div>

          {guests.length > 0 && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-burgundy/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests..."
                className="w-full rounded-xl border border-burgundy/15 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-rose-gold" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-burgundy/50">
              {guests.length === 0
                ? 'No guests yet. Add your first guest above to generate a personalized link.'
                : 'No guests match your search.'}
            </p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((g) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-3 rounded-xl border border-burgundy/10 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-burgundy">{g.name}</p>
                      {g.address && (
                        <p className="mt-0.5 truncate text-xs text-burgundy/55">{g.address}</p>
                      )}
                      <p className="mt-1 truncate font-mono text-[11px] text-rose-gold-dark/70">
                        /invite/{g.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/invite/${encodeURIComponent(g.slug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/15 bg-white/70 text-burgundy transition hover:bg-blush/40"
                        title="Open invitation preview"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Dear ${g.name},\n\nYou are warmly invited to celebrate with us. Please open your personalized invitation: ${origin}/invite/${encodeURIComponent(g.slug)}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center gap-1.5 rounded-full border border-green-700/20 bg-white/70 px-3 text-xs font-semibold text-green-800 transition hover:bg-green-50"
                        title="Send a personalized WhatsApp invitation"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                      <button
                        onClick={() => copyLink(g.slug)}
                        className="flex h-9 items-center gap-1.5 rounded-full border border-burgundy/15 bg-white/70 px-3 text-xs font-semibold text-burgundy transition hover:bg-blush/40"
                      >
                        {copiedSlug === g.slug ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteGuest(g.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/15 bg-white/70 text-burgundy/60 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete guest"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-burgundy/40">
          Each guest gets a unique link that shows their name and address on the invitation.
        </p>
          </>
        )}
      </div>
    </main>
  );
}