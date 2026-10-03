import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ComplaintComment } from '@/types';
import { complaintCommentSchema } from '@/lib/validations/complaint';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const comments = await db.collection<ComplaintComment>('complaint_comments')
      .find({ complaintId: id.toUpperCase(), isPublic: true })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Get complaint comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = complaintCommentSchema.parse(await request.json());
    const db = await getDb();
    const complaintId = id.trim().toUpperCase();
    const complaint = await db.collection('complaints').findOne({ complaintId });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const comment: ComplaintComment = {
      complaintId,
      ...body,
      createdAt: new Date(),
      isPublic: true,
    };
    await db.collection<ComplaintComment>('complaint_comments').insertOne(comment as any);

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid comment', details: error.errors }, { status: 400 });
    }
    console.error('Create complaint comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
