import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';
import { loginSchema } from '@/lib/validations/auth';
import { User, toUserResponse } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }

    // Connect to database
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = toUserResponse(user);

    return NextResponse.json(
      {
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
