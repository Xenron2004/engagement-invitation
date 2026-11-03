'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { invitation, type Couple } from '@/lib/invitation-data';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

function PersonCard({ person, index }: { person: Couple; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative mb-6 overflow-hidden rounded-full border-2 border-gold/50 shadow-2xl">
        <div className="h-56 w-56 overflow-hidden rounded-full sm:h-64 sm:w-64">
          <Image
            src={person.photo}
            alt={person.name}
            width={512}
            height={512}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
      </div>
      <h3 className="font-display text-3xl font-bold text-burgundy">{person.name}</h3>
      <p className="mt-1 font-script text-2xl text-rose-gold">
        {person.tagline} {person.parents[person.lineageParent]}
      </p>
      <div className="my-3 w-24 gold-divider" />
      <p className="text-center text-sm italic text-burgundy/70">
        Father: {person.parents.father}
        <br />
        Mother: {person.parents.mother}
      </p>
      <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-burgundy/80">
        {person.description}
      </p>
    </motion.div>
  );
}

export default function CoupleSection() {
  return (
    <section id="couple" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">The Bride &amp; Groom</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            Two Souls, One Story
          </h2>
          <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-16 sm:flex-row sm:gap-12">
          <PersonCard person={invitation.groom} index={0} />

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hidden sm:block"
          >
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full glass gold-border">
                <Heart className="h-7 w-7 fill-rose-gold/40 text-rose-gold animate-glow-pulse" />
              </div>
            </div>
          </motion.div>

          <PersonCard person={invitation.bride} index={1} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto mt-16 max-w-xl text-center font-script text-2xl text-rose-gold"
        >
          &ldquo;And when we met, the stars aligned, and the universe whispered — it was always you.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}