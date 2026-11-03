'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroEnvelope from '@/components/invitation/hero-envelope';
import CoupleSection from '@/components/invitation/couple-section';
import EventDetails from '@/components/invitation/event-details';
import EventHighlights from '@/components/invitation/event-highlights';
import RecipientSection from '@/components/invitation/recipient-section';
import PhotoGallery from '@/components/invitation/photo-gallery';
import RsvpForm from '@/components/invitation/rsvp-form';
import ShareCard from '@/components/invitation/share-card';
import Footer from '@/components/invitation/footer';
import PetalsBackground from '@/components/invitation/petals-background';
import MusicToggle, { type MusicToggleHandle } from '@/components/invitation/music-toggle';
import ScrollProgress from '@/components/invitation/scroll-progress';
import { invitation, fallbackGuest, type Guest } from '@/lib/invitation-data';

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestLoading, setGuestLoading] = useState(true);
  const [guestError, setGuestError] = useState<string | null>(null);
  const musicRef = useRef<MusicToggleHandle>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathSlug = window.location.pathname.match(/^\/invite\/([^/]+)\/?$/)?.[1];
    const slug = params.get('g') ?? (pathSlug ? decodeURIComponent(pathSlug) : null);
    if (!slug) {
      setGuestLoading(false);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/guests/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to load this invitation.');
        }
        setGuestId(data.id);
        setGuest({
          name: data.name,
          salutation: 'Dear',
          address: data.address ?? '',
          message: fallbackGuest.message,
        });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setGuestError(error instanceof Error ? error.message : 'Unable to load this invitation.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setGuestLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Lock scroll until opened
  useEffect(() => {
    if (!opened || guestLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened, guestLoading]);

  const displayGuest: Guest = guest ?? fallbackGuest;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-ivory via-blush/30 to-ivory">
      <PetalsBackground />
      <ScrollProgress />
      {guestError && (
        <p role="alert" className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700 shadow">
          {guestError}
        </p>
      )}

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope-view"
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6 } }}
          >
            <HeroEnvelope
              onOpen={() => setOpened(true)}
              onMusicStart={() => musicRef.current?.play()}
              guestName={guest ? displayGuest.name : null}
            />
          </motion.div>
        ) : (
          <motion.div
            key="invitation-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Hero content section after opening */}
            <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.pexels.com/photos/3971105/pexels-photo-3971105.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-burgundy/50 via-burgundy/25 to-ivory" />
              </div>
              <div className="relative z-10 px-6 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-script text-3xl text-rose-gold"
                >
                  {invitation.eventType}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="mt-4 font-display text-6xl font-bold text-ivory drop-shadow-xl sm:text-8xl"
                >
                  {invitation.groom.firstName}{' '}
                  <span className="font-script text-5xl text-rose-gold sm:text-7xl">&amp;</span>{' '}
                  {invitation.bride.firstName}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '12rem' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mx-auto my-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="font-display text-lg uppercase tracking-[0.25em] text-ivory/90 sm:text-xl"
                >
                  {invitation.eventDateLabel}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                  className="mt-2 text-sm uppercase tracking-[0.2em] text-ivory/70"
                >
                  {invitation.primaryVenue}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                  className="mt-10"
                >
                  <a
                    href="#couple"
                    className="btn-luxe inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em]"
                  >
                    Begin the Journey
                  </a>
                </motion.div>
              </div>
            </section>

            <CoupleSection />
            <EventDetails />
            <RecipientSection guest={displayGuest} />
            <EventHighlights />
            <PhotoGallery />
            <RsvpForm guest={displayGuest} guestId={guestId} />
            <ShareCard guest={displayGuest} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <MusicToggle ref={musicRef} />
    </main>
  );
}