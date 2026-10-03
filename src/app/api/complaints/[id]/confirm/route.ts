import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const voterKey = typeof body.voterKey === 'string' ? body.voterKey.trim() : '';

    if (voterKey.length < 12 || voterKey.length > 100) {
      return NextResponse.json({ error: 'A valid voter key is required' }, { status: 400 });
    }

    const db = await getDb();
    const complaintId = id.trim().toUpperCase();
    const complaints = db.collection('complaints');
    const complaint = await complaints.findOne({ complaintId });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const keys = Array.isArray(complaint.confirmationKeys) ? complaint.confirmationKeys : [];
    if (keys.includes(voterKey)) {
      return NextResponse.json({ confirmed: true, count: complaint.confirmationCount || keys.length });
    }

    const result = await complaints.findOneAndUpdate(
      { complaintId, confirmationKeys: { $ne: voterKey } },
      { $addToSet: { confirmationKeys: voterKey }, $inc: { confirmationCount: 1 } },
      { returnDocument: 'after' }
    );

    return NextResponse.json({
      confirmed: true,
      count: result?.confirmationCount || (complaint.confirmationCount || 0) + 1,
    });
  } catch (error) {
    console.error('Confirm complaint error:', error);
    return NextResponse.json({ error: 'Failed to confirm complaint' }, { status: 500 });
  }
}
