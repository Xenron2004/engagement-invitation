'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { invitation, type Guest } from '@/lib/invitation-data';

type Props = {
  guest: Guest;
};

export default function ShareCard({ guest }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareText = `You're invited! ${invitation.groom.firstName} & ${invitation.bride.firstName} are getting engaged on ${invitation.eventDateLabel}. Open your invitation:`;
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com';
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${inviteUrl}`)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="share" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">Spread the Joy</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            Share This Invitation
          </h2>
          <p className="mt-4 text-sm text-burgundy/60">
            This invitation is personalized for {guest.name}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-8 text-center sm:p-10"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
              <Share2 className="h-6 w-6" />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </a>

            {/* Copy link */}
            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-2 rounded-full border border-burgundy/20 bg-white/60 px-6 py-3 text-sm font-semibold text-burgundy transition hover:scale-105 hover:bg-blush/40"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? 'Link Copied!' : 'Copy Invitation Link'}
            </button>

            {/* QR toggle */}
            <button
              onClick={() => setShowQR((s) => !s)}
              className="flex items-center justify-center gap-2 rounded-full border border-burgundy/20 bg-white/60 px-6 py-3 text-sm font-semibold text-burgundy transition hover:scale-105 hover:bg-blush/40"
            >
              <Share2 className="h-4 w-4" />
              {showQR ? 'Hide' : 'Show'} QR Code
            </button>
          </div>

          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-green-700"
            >
              Invitation link copied to clipboard
            </motion.p>
          )}

          {/* QR Code */}
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              className="flex flex-col items-center"
            >
              <div className="rounded-2xl bg-white p-4 shadow-lg">
                <QRCodeSVG
                  value={inviteUrl}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#7a1f3d"
                  level="M"
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-widest text-burgundy/50">
                Scan to open invitation
              </p>
            </motion.div>
          )}

          {!showQR && (
            <p className="mt-6 text-xs text-burgundy/50">
              <Copy className="mr-1 inline h-3 w-3" />
              Unique invitation link for {guest.name}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}