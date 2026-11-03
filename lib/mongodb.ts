import { MongoClient, type Collection, type Document } from 'mongodb';

declare global {
  var mongodbClientPromise: Promise<MongoClient> | undefined;
}

async function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (!global.mongodbClientPromise) {
    global.mongodbClientPromise = new MongoClient(uri).connect();
  }
  try {
    return await global.mongodbClientPromise;
  } catch (error) {
    global.mongodbClientPromise = undefined;
    throw error;
  }
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const client = await getClient();
  return client.db('wedding_invitation').collection<T>(name);
}
