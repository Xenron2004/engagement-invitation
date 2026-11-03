'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { invitation } from '@/lib/invitation-data';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden py-20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-burgundy/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-script text-3xl text-rose-gold">Forever &amp; Always</p>
          <h2 className="mt-3 font-display text-5xl font-bold text-ivory drop-shadow-lg sm:text-6xl">
            Dr. Kislay <span className="font-script text-4xl text-rose-gold">&amp;</span> Sakshi
          </h2>
          <div className="mx-auto my-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="font-display text-lg text-ivory/90">{invitation.eventDateLabel}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.25em] text-ivory/70">
            {invitation.primaryVenue}
          </p>

          <div className="mt-10 flex items-center justify-center gap-2 text-ivory/60">
            <span className="h-px w-12 bg-gold/40" />
            <Heart className="h-4 w-4 fill-rose-gold/40 text-rose-gold" />
            <span className="h-px w-12 bg-gold/40" />
          </div>

          <p className="mt-6 font-script text-2xl text-rose-gold">
            Thank you for being part of our story
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-ivory/50">
            {invitation.hashtag}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}