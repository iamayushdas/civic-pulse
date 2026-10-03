import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/mongodb';
import { registerSchema } from '@/lib/validations/auth';
import { User, toUserResponse } from '@/models/User';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validationResult.data;

    // Connect to database
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser: Omit<User, '_id'> = {
      userId: nanoid(),
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'CITIZEN', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser as User);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.userId, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = toUserResponse({ ...newUser, _id: result.insertedId } as User);

    return NextResponse.json(
      {
        user: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
