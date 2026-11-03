import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

type RsvpRecord = {
  guest_id: string | null;
  name: string;
  phone: string | null;
  attendees: number;
  attending: 'yes' | 'no' | 'maybe';
  message: string | null;
  created_at: Date;
};

export async function POST(request: Request) {
  let body: Partial<RsvpRecord>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const attendance = body.attending;
  const attendees = body.attendees;
  if (
    !name ||
    name.length > 120 ||
    phone.length > 40 ||
    message.length > 1000 ||
    typeof attendees !== 'number' ||
    !Number.isInteger(attendees) ||
    attendees < 1 ||
    attendees > 10 ||
    (attendance !== 'yes' && attendance !== 'no' && attendance !== 'maybe')
  ) {
    return NextResponse.json({ error: 'Please check the RSVP details and try again.' }, { status: 400 });
  }

  const guestId = typeof body.guest_id === 'string' ? body.guest_id : null;
  await (await getCollection<RsvpRecord>('rsvps')).insertOne({
    guest_id: guestId,
    name,
    phone: phone || null,
    attendees,
    attending: attendance,
    message: message || null,
    created_at: new Date(),
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
