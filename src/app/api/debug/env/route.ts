import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mongodb_uri_set: !!process.env.MONGODB_URI,
    jwt_secret_set: !!process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV,
    mongodb_uri_preview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET',
  });
}
