'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, PartyPopper } from 'lucide-react';
import { invitation } from '@/lib/invitation-data';

const iconMap: Record<string, typeof Sparkles> = {
  ring: Sparkles,
  family: Users,
  celebration: PartyPopper,
};

export default function EventHighlights() {
  return (
    <section id="highlights" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">The Evening&apos;s Joy</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            What to Expect
          </h2>
          <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {invitation.highlights.map((h, i) => {
            const Icon = iconMap[h.icon] ?? Sparkles;
            return (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="glass group rounded-2xl p-6 text-center transition-shadow hover:shadow-xl"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-gold/20 to-champagne/20 ring-1 ring-gold/30 transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7 text-rose-gold-dark" />
                </div>
                <h3 className="font-display text-xl font-semibold text-burgundy">{h.title}</h3>
                <div className="mx-auto my-3 h-px w-12 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <p className="text-sm leading-relaxed text-burgundy/70">{h.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}