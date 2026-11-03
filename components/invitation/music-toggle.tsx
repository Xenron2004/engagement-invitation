'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type MusicToggleHandle = {
  play: () => void;
};

const melody = [293.66, 369.99, 440, 554.37, 493.88, 440, 369.99, 329.63];
const chordRoots = [146.83, 110, 123.47, 98];
const beatDuration = 0.82;

const MusicToggle = forwardRef<MusicToggleHandle>(function MusicToggle(_props, ref) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const nextNoteTimeRef = useRef(0);
  const lastScrollStepRef = useRef(0);

  const ensureContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    try {
      const context = ensureContext();
      if (context.state === 'suspended') void context.resume();

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, start);
      oscillator.frequency.exponentialRampToValueAtTime(659.25, start + 0.09);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.035, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.15);
    } catch (playbackError) {
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : 'The interaction sound could not be played.'
      );
    }
  }, [ensureContext]);

  const playScrollChime = useCallback(() => {
    try {
      const context = ensureContext();
      if (context.state !== 'running') return;

      const start = context.currentTime;
      [783.99, 987.77].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.014, start + 0.02 + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4 + index * 0.07);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start + index * 0.07);
        oscillator.stop(start + 0.5 + index * 0.07);
      });
    } catch (playbackError) {
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : 'The scroll sound could not be played.'
      );
    }
  }, [ensureContext]);

  const play = useCallback(async () => {
    try {
      const context = ensureContext();
      await context.resume();

      const scheduleNotes = () => {
        while (nextNoteTimeRef.current < context.currentTime + 0.12) {
          const index = noteIndexRef.current;
          const start = nextNoteTimeRef.current;
          const melodyOscillator = context.createOscillator();
          const melodyGain = context.createGain();
          melodyOscillator.type = 'sine';
          melodyOscillator.frequency.value = melody[index % melody.length];
          melodyGain.gain.setValueAtTime(0.0001, start);
          melodyGain.gain.exponentialRampToValueAtTime(0.025, start + 0.08);
          melodyGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);
          melodyOscillator.connect(melodyGain);
          melodyGain.connect(context.destination);
          melodyOscillator.start(start);
          melodyOscillator.stop(start + 0.74);

          if (index % 4 === 0) {
            const root = chordRoots[(index / 4) % chordRoots.length];
            [root, root * 1.5, root * 2].forEach((frequency) => {
              const pad = context.createOscillator();
              const padGain = context.createGain();
              pad.type = 'sine';
              pad.frequency.value = frequency;
              padGain.gain.setValueAtTime(0.0001, start);
              padGain.gain.exponentialRampToValueAtTime(0.009, start + 0.35);
              padGain.gain.setValueAtTime(0.009, start + beatDuration * 3.5);
              padGain.gain.exponentialRampToValueAtTime(0.0001, start + beatDuration * 4);
              pad.connect(padGain);
              padGain.connect(context.destination);
              pad.start(start);
              pad.stop(start + beatDuration * 4 + 0.05);
            });
          }

          noteIndexRef.current += 1;
          nextNoteTimeRef.current += beatDuration;
        }
      };

      if (schedulerRef.current !== null) {
        window.clearInterval(schedulerRef.current);
      }
      nextNoteTimeRef.current = context.currentTime + 0.05;
      scheduleNotes();
      schedulerRef.current = window.setInterval(scheduleNotes, 120);
      setError(null);
      setPlaying(true);
    } catch (playbackError) {
      setPlaying(false);
      setError(
        playbackError instanceof Error
          ? playbackError.message
          : 'Background music could not be started.'
      );
    }
  }, [ensureContext]);

  const pause = useCallback(async () => {
    if (schedulerRef.current !== null) {
      window.clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }
    await audioContextRef.current?.suspend();
    setPlaying(false);
  }, []);

  useImperativeHandle(ref, () => ({ play }), [play]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest(
        'button, a[href], [role="button"], input[type="button"], input[type="submit"]'
      );
      if (!control || control.hasAttribute('data-audio-toggle')) return;
      playClick();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [playClick]);

  useEffect(() => {
    if (!playing) {
      lastScrollStepRef.current = Math.floor(window.scrollY / 500);
      return;
    }

    lastScrollStepRef.current = Math.floor(window.scrollY / 500);
    let lastPlayedAt = 0;
    const handleScroll = () => {
      const currentStep = Math.floor(window.scrollY / 500);
      if (currentStep === lastScrollStepRef.current) return;

      lastScrollStepRef.current = currentStep;
      const now = Date.now();
      if (now - lastPlayedAt < 700) return;
      lastPlayedAt = now;
      playScrollChime();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playing, playScrollChime]);

  useEffect(
    () => () => {
      if (schedulerRef.current !== null) {
        window.clearInterval(schedulerRef.current);
      }
      void audioContextRef.current?.close();
    },
    []
  );

  const toggle = () => {
    if (playing) {
      void pause();
    } else {
      void play();
    }
  };

  return (
    <button
      data-audio-toggle
      onClick={toggle}
      aria-label={playing ? 'Turn engagement music off' : 'Turn engagement music on'}
      aria-describedby={error ? 'music-error' : undefined}
      className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full glass gold-border text-burgundy transition-all hover:scale-110 active:scale-95"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={playing ? 'playing' : 'paused'}
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
          transition={{ duration: 0.3 }}
        >
          {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
      {playing && (
        <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-60" />
      )}
      {error && (
        <span id="music-error" className="sr-only" role="status">
          Audio unavailable: {error}
        </span>
      )}
    </button>
  );
});

export default MusicToggle;
