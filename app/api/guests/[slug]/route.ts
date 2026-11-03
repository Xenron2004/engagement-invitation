import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { managerAuthError } from '@/lib/manager-auth';

export const dynamic = 'force-dynamic';

type GuestRecord = {
  slug: string;
  name: string;
  address: string | null;
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const guest = await (await getCollection<GuestRecord>('guests')).findOne(
    { slug: params.slug },
    { projection: { _id: 1, slug: 1, name: 1, address: 1 } }
  );

  if (!guest) {
    return NextResponse.json({ error: 'Invitation link not found.' }, { status: 404 });
  }

  return NextResponse.json({
    id: guest._id.toString(),
    slug: guest.slug,
    name: guest.name,
    address: guest.address,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const authError = managerAuthError(request);
  if (authError) return authError;
  const guest = await (await getCollection('guests')).findOneAndDelete({ slug: params.slug });
  if (!guest) {
    return NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
  }
  await (await getCollection('rsvps')).deleteMany({ guest_id: guest._id.toString() });
  return NextResponse.json({ success: true });
}
