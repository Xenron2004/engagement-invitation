'use client';

import { useEffect, useState } from 'react';

type Petal = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  emoji: string;
};

const PETAL_EMOJIS = ['🌸', '🌹', '🌷', '✨'];

export default function PetalsBackground() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generated: Petal[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 18,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 12,
      drift: (Math.random() - 0.5) * 120,
      opacity: 0.35 + Math.random() * 0.4,
      emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-10%] animate-float-up select-none"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `translateX(${p.drift}px)`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      {/* Glowing particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={`glow-${i}`}
          className="absolute rounded-full bg-gold/30 blur-[2px] animate-glow-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}