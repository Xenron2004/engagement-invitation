'use client';

import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import { invitation, type Guest } from '@/lib/invitation-data';

type Props = {
  guest: Guest;
};

export default function RecipientSection({ guest }: Props) {
  return (
    <section id="recipient" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-14"
        >
          {/* Ornamental top */}
          <div className="mb-6 flex items-center justify-center gap-3 text-rose-gold">
            <span className="text-2xl">❦</span>
            <ScrollText className="h-5 w-5" />
            <span className="text-2xl">❦</span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-script text-3xl text-rose-gold"
          >
            {guest.salutation} {guest.name}
          </motion.p>

          {guest.address && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-sm italic text-burgundy/60"
            >
              {guest.address}
            </motion.p>
          )}

          <div className="mx-auto my-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base leading-loose text-burgundy/85 sm:text-lg"
          >
            {invitation.inviteMessage}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8"
          >
            <p className="font-script text-2xl text-rose-gold">With love,</p>
            <p className="mt-1 font-display text-xl font-semibold text-burgundy">
              The K.K. Anand's Family
            </p>
          </motion.div>

          {/* Decorative border flourish */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gold/60">
            {invitation.hashtag}
          </div>
        </motion.div>
      </div>
    </section>
  );
}