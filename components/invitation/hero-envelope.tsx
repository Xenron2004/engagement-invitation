'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { invitation } from '@/lib/invitation-data';

type Props = {
  onOpen: () => void;
  onMusicStart: () => void;
  guestName: string | null;
};

export default function HeroEnvelope({ onOpen, onMusicStart, guestName }: Props) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    onMusicStart();
    setTimeout(() => onOpen(), 1400);
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3971105/pexels-photo-3971105.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/40 via-burgundy/30 to-burgundy/60" />
        <div className="absolute inset-0 bg-gradient-radial from-rose-gold/20 via-transparent to-burgundy/30" />
      </div>

      {/* Decorative corners */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-6 top-6 h-20 w-20 border-l-2 border-t-2 border-gold/50 rounded-tl-xl" />
        <div className="absolute right-6 top-6 h-20 w-20 border-r-2 border-t-2 border-gold/50 rounded-tr-xl" />
        <div className="absolute left-6 bottom-6 h-20 w-20 border-l-2 border-b-2 border-gold/50 rounded-bl-xl" />
        <div className="absolute right-6 bottom-6 h-20 w-20 border-r-2 border-b-2 border-gold/50 rounded-br-xl" />
      </div>

      <AnimatePresence mode="wait">
        {!opening ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.6 } }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-20 flex flex-col items-center px-6 text-center"
          >
            {/* Envelope card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="glass-dark relative mb-8 w-[min(90vw,420px)] rounded-2xl px-8 py-10 text-center"
            >
              {guestName && (
                <>
                  <p className="font-script text-2xl text-rose-gold/90">Dear {guestName},</p>
                  <div className="my-3 gold-divider" />
                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-ivory/70">
                    You are cordially invited to the
                  </p>
                </>
              )}
              {!guestName && (
                <p className="font-script text-2xl text-rose-gold/90">Together with their families</p>
              )}
              <div className={guestName ? '' : 'my-4 gold-divider'} />
              <h1 className="font-display text-5xl font-bold text-ivory drop-shadow-lg sm:text-6xl">
                Dr. Kislay
              </h1>
              <p className="my-2 font-script text-3xl text-rose-gold">&amp;</p>
              <h1 className="font-display text-5xl font-bold text-ivory drop-shadow-lg sm:text-6xl">
                Sakshi
              </h1>
              <div className="my-4 gold-divider" />
              <p className="text-xs uppercase tracking-[0.25em] text-rose-gold/90">
                {invitation.eventType}
              </p>
              <p className="mt-2 font-serif text-sm uppercase tracking-[0.25em] text-ivory/80">
                {invitation.eventDateLabel}
              </p>
              <p className="mt-1 font-serif text-xs tracking-widest text-ivory/60">
                {invitation.primaryVenue}
              </p>
            </motion.div>

            {/* Open Invitation button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              className="btn-luxe group flex items-center gap-3 rounded-full px-9 py-4 text-sm font-medium uppercase tracking-[0.2em]"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Open Invitation
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="mt-8 flex flex-col items-center gap-1 text-xs uppercase tracking-[0.3em] text-ivory/60"
            >
              <span>Scroll to explore after opening</span>
              <ChevronDown className="h-4 w-4 animate-soft-bounce" />
            </motion.p>
          </motion.div>
        ) : (
          /* Opening animation: envelope unfolds */
          <motion.div
            key="opening"
            className="relative z-20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1, rotateY: 0 }}
              animate={{ scale: 1.4, rotateY: 90, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.6, 0, 0.4, 1] }}
              className="glass-dark relative h-48 w-[min(80vw,360px)] rounded-xl"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-4xl text-rose-gold">
                K &amp; S
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}