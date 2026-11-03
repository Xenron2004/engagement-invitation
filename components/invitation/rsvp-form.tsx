'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CalendarCheck, Heart, Loader2 } from 'lucide-react';
import { invitation, type Guest } from '@/lib/invitation-data';

type Attendance = 'yes' | 'no' | 'maybe';

type Props = {
  guest: Guest;
  guestId: string | null;
};

export default function RsvpForm({ guest, guestId }: Props) {
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [attendance, setAttendance] = useState<Attendance>('yes');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guestId,
          name: name.trim(),
          phone: phone.trim() || null,
          attendees,
          attending: attendance,
          message: message.trim() || null,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? 'Something went wrong sending your RSVP.');
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong sending your RSVP. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">Will You Join Us?</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            RSVP
          </h2>
          <p className="mt-4 text-sm text-burgundy/60">
            Kindly respond by {invitation.rsvpDeadline}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-10 text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-burgundy/10">
                <Heart className="h-10 w-10 fill-rose-gold/40 text-rose-gold animate-glow-pulse" />
              </div>
              <h3 className="font-display text-3xl font-bold text-burgundy">
                Thank You, {name.split(' ')[0]}!
              </h3>
              <p className="mt-3 text-burgundy/75">
                {attendance === 'no'
                  ? 'We will miss your presence, but you will be in our hearts on the special day.'
                  : `We can't wait to celebrate with you${
                      attendees > 1 ? ` and your ${attendees - 1} guest${attendees > 2 ? 's' : ''}` : ''
                    }. See you soon!`}
              </p>
              {message && (
                <p className="mt-4 rounded-xl bg-blush/40 p-4 font-script text-xl text-burgundy/80">
                  &ldquo;{message}&rdquo;
                </p>
              )}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="btn-luxe mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm uppercase tracking-wider"
              >
                <CalendarCheck className="h-4 w-4" />
                Done
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              onSubmit={handleSubmit}
              className="glass rounded-3xl p-8 sm:p-10"
            >
              {/* Name */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Patel"
                  className="w-full rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>

              {/* Attendees */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                  Number of Attendees
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendees((n) => Math.max(1, n - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-burgundy/15 bg-white/60 text-xl text-burgundy transition hover:bg-rose-gold/20"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-display text-2xl font-bold text-burgundy">
                    {attendees}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttendees((n) => Math.min(10, n + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-burgundy/15 bg-white/60 text-xl text-burgundy transition hover:bg-rose-gold/20"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Attendance */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { val: 'yes', label: 'Joyfully', icon: '🎉' },
                    { val: 'maybe', label: 'Perhaps', icon: '🤔' },
                    { val: 'no', label: 'Regretfully', icon: '💔' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setAttendance(opt.val)}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 transition ${
                        attendance === opt.val
                          ? 'border-rose-gold bg-rose-gold/20 text-burgundy shadow-md'
                          : 'border-burgundy/15 bg-white/50 text-burgundy/70 hover:bg-blush/40'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-burgundy/60">
                  Your Message / Wishes
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Share your blessings and wishes for the couple..."
                  className="w-full resize-none rounded-xl border border-burgundy/15 bg-white/60 px-4 py-3 text-burgundy outline-none transition focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/30"
                />
              </div>

              {error && (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}

              <motion.button
                type="submit"
                disabled={submitting || !name.trim()}
                whileHover={{ scale: submitting ? 1 : 1.03 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="btn-luxe flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm RSVP
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}