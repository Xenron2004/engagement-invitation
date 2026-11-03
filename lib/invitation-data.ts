export type Couple = {
  firstName: string;
  name: string;
  fullName: string;
  photo: string;
  parents: { father: string; mother: string };
  tagline: string;
  lineageParent: 'father' | 'mother';
  description: string;
};

export type Guest = {
  name: string;
  salutation: string;
  address: string;
  message: string;
};

export const invitation = {
  eventType: 'Engagement Ceremony',
  groom: {
    firstName: 'Dr. Kislay',
    name: ' Dr. Kislay Kumar Anand',
    fullName: 'Dr. Kislay Kumar Anand',
    photo: '/images/kislay-ghibli.png',
    parents: {
      father: 'Late. Dr. Vijay Kumar Singh',
      mother: 'Mrs. Reeta Mehta',
    },
    tagline: 'Son of',
    lineageParent: 'father',
    description:
      'A thoughtful soul with a love for travel, classical music, and long conversations over chai. Kislay finds joy in the little things and is ready to find his forever in Sakshi.',
  } as Couple,

  bride: {
    firstName: 'Sakshi',
    name: 'Sakshi Kumari',
    fullName: 'Sakshi Kumari',
    photo: '/images/sakshi-ghibli.png',
    parents: {
      father: 'Shriram Singh',
      mother: 'Vibha Singh',
    },
    tagline: 'Daughter of',
    lineageParent: 'father',
    description:
      'An artist at heart, Sakshi paints the world in hues of kindness and warmth. She loves gardening, poetry, and the quiet magic of monsoon mornings.',
  } as Couple,

  hashtag: '#kislayengagedtosakshi',
  eventDate: '2026-11-21',
  eventDateLabel: 'Saturday, 21st November 2026',
  eventTime: '9:00 AM onwards',
  primaryVenue: 'Shagun Marriage Hall, Maliyabagh',
  primaryAddress: 'Maliyabagh, Rohtas, Bihar 821310, India',
  mapsQuery: '  Shagun Marriage Hall, Maliyabagh, Rohtas, Bihar 802211, India',
  inviteMessage:
    'Two souls, one promise. With the blessings of our elders and the warmth of your presence, we celebrate the beginning of our journey together. Your love and good wishes have always been our greatest treasure, and we would be honored to have you bless us as we exchange rings and make our promise official.',
  rsvpDeadline: '21st November 2026',

  // Engagement event highlights
  highlights: [
    {
      icon: 'ring',
      title: 'Ring Exchange',
      description: 'The sacred moment when Aditya and Sakshi exchange rings, sealing their promise.',
    },
    {
      icon: 'family',
      title: 'Family Blessings',
      description: 'Elders from both families bless the couple for a lifetime of happiness.',
    },
    {
      icon: 'celebration',
      title: 'Celebration & Party',
      description: 'A day of music, laughter, and a grand party under a canopy of lights.',
    },
  ] as { icon: string; title: string; description: string }[],
};

// Fallback guest shown when the invitation is opened without a slug (e.g. the demo/preview).
export const fallbackGuest: Guest = {
  name: 'Our Cherished Guest',
  salutation: 'Dear',
  address: '',
  message:
    'Your presence has always been a blessing in our lives. We would be delighted to have you grace our engagement celebration with your love and warm wishes.',
};

export function formatDate(dateStr: string): { day: string; month: string; year: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}

// Generate a short URL-safe slug from a name.
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30) || 'guest';
  const suffix = crypto.randomUUID().slice(0, 12);
  return `${base}-${suffix}`;
}
