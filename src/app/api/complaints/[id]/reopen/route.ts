import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Complaint } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const complaints = db.collection<Complaint>('complaints');
    const complaintId = id.trim().toUpperCase();
    const complaint = await complaints.findOne({ complaintId });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }
    if (complaint.status !== 'RESOLVED') {
      return NextResponse.json({ error: 'Only resolved complaints can be reopened' }, { status: 409 });
    }

    const now = new Date();
    await complaints.updateOne(
      { complaintId },
      {
        $set: { status: 'REOPENED', updatedAt: now },
        $push: { statusHistory: { status: 'REOPENED', timestamp: now, note: 'Issue reported as unresolved', isPublic: true } },
      }
    );

    return NextResponse.json({ success: true, status: 'REOPENED' });
  } catch (error) {
    console.error('Reopen complaint error:', error);
    return NextResponse.json({ error: 'Failed to reopen complaint' }, { status: 500 });
  }
}
