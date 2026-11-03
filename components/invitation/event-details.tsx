'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Navigation } from 'lucide-react';
import { invitation, formatDate } from '@/lib/invitation-data';

export default function EventDetails() {
  const date = formatDate(invitation.eventDate);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    invitation.mapsQuery
  )}`;

  return (
    <section id="event-details" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">Save the Date</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            The Engagement Celebration
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          {/* Floral corner accents */}
          <div className="pointer-events-none absolute -left-8 -top-8 text-6xl opacity-15 rotate-12">🌸</div>
          <div className="pointer-events-none absolute -right-6 -bottom-8 text-6xl opacity-15 -rotate-12">🌿</div>

          {/* Date block */}
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="flex flex-col items-center rounded-xl border border-gold/40 bg-blush/40 px-6 py-4 text-burgundy shadow-sm">
              <span className="font-display text-2xl font-bold leading-none">{date.day}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest">{date.month}</span>
            </div>
            <div className="text-center">
              <p className="font-script text-2xl text-rose-gold">{invitation.eventDateLabel.split(',')[0]}</p>
              <p className="font-display text-3xl font-bold text-burgundy">{date.year}</p>
            </div>
          </div>

          <div className="mx-auto mb-8 h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          {/* Detail rows */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-burgundy/50">Date</p>
                <p className="font-display text-lg font-semibold text-burgundy">{invitation.eventDateLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-burgundy/50">Time</p>
                <p className="font-display text-lg font-semibold text-burgundy">{invitation.eventTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 sm:col-span-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-burgundy/50">Venue</p>
                <p className="font-display text-lg font-semibold text-burgundy">{invitation.primaryVenue}</p>
                <p className="text-sm text-burgundy/70">{invitation.primaryAddress}</p>
              </div>
            </div>
          </div>

          {/* Directions button */}
          <motion.a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-luxe mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] sm:w-auto sm:mx-auto"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}