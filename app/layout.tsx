import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Cinzel, Great_Vibes } from 'next/font/google';
import kislaySakshi from '@/components/assets/kislay_sakshi.png';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bolt.new'),
  title: 'Dr. Kislay & Sakshi | Engagement Invitation',
  description:
    'With the blessings of our families, we invite you to celebrate the engagement of Dr. Kislay & Sakshi. Join us on our special day.',
  openGraph: {
    title: 'Dr. Kislay & Sakshi | Engagement Invitation',
    description:
      'You are cordially invited to the engagement of Dr. Kislay & Sakshi. Open your invitation to join the celebration.',
    images: [
      {
      url: kislaySakshi.src,
      width: kislaySakshi.width,
      height: kislaySakshi.height,
      alt: 'Kislay and Sakshi',
    },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
      url: kislaySakshi.src,
      width: kislaySakshi.width,
      height: kislaySakshi.height,
      alt: 'Kislay and Sakshi',
    },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${greatVibes.variable}`}>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
