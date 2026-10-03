import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

// MongoDB connection options optimized for Vercel
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  // Disable SSL certificate verification for development/Vercel
  ...(process.env.NODE_ENV === 'development' ? {} : {
    tls: true,
    tlsAllowInvalidCertificates: true,
  }),
};

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
