import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add MONGODB_URI to .env.local');
  }
  if (!clientPromise) {
    throw new Error('MongoDB client not initialized');
  }
  const client = await clientPromise;
  return client.db('delhi-civic');
}

export default clientPromise;
