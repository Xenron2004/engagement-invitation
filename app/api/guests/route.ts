import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { managerAuthError } from '@/lib/manager-auth';
import { generateSlug } from '@/lib/invitation-data';

export const dynamic = 'force-dynamic';

type GuestRecord = {
  slug: string;
  name: string;
  address: string | null;
  created_at: Date;
};

async function guestsCollection() {
  const collection = await getCollection<GuestRecord>('guests');
  await collection.createIndex({ slug: 1 }, { unique: true });
  return collection;
}

export async function GET(request: Request) {
  const authError = managerAuthError(request);
  if (authError) return authError;

  const collection = await guestsCollection();
  const guests = await collection.find().sort({ created_at: -1 }).toArray();
  return NextResponse.json(
    guests.map(({ _id, slug, name, address, created_at }) => ({
      id: _id.toString(),
      slug,
      name,
      address,
      created_at,
    }))
  );
}

export async function POST(request: Request) {
  const authError = managerAuthError(request);
  if (authError) return authError;

  let body: { name?: unknown; address?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (!name || name.length > 120 || address.length > 300) {
    return NextResponse.json(
      { error: 'Enter a name (up to 120 characters) and an address up to 300 characters.' },
      { status: 400 }
    );
  }

  const collection = await guestsCollection();
  const guest = {
    slug: generateSlug(name),
    name,
    address: address || null,
    created_at: new Date(),
  };
  const result = await collection.insertOne(guest);

  return NextResponse.json({ id: result.insertedId.toString(), ...guest }, { status: 201 });
}
