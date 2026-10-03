import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Complaint } from '@/types';

function words(value: string): Set<string> {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
}

function overlap(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  left.forEach((word) => {
    if (right.has(word)) shared += 1;
  });
  return shared / Math.max(left.size, right.size);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const complaints = db.collection<Complaint>('complaints');
    const complaint = await complaints.findOne({ complaintId: id.trim().toUpperCase() });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const candidates = await complaints.find({
      complaintId: { $ne: complaint.complaintId },
      category: complaint.category,
      area: complaint.area,
      status: { $nin: ['DUPLICATE', 'REJECTED'] },
    }).sort({ createdAt: -1 }).limit(50).toArray();

    const sourceWords = words(`${complaint.title} ${complaint.description}`);
    const matches = candidates
      .map((candidate) => {
        const textScore = overlap(sourceWords, words(`${candidate.title} ${candidate.description}`));
        const latDifference = Math.abs((candidate.location?.lat || 0) - (complaint.location?.lat || 0));
        const lngDifference = Math.abs((candidate.location?.lng || 0) - (complaint.location?.lng || 0));
        const nearby = latDifference < 0.01 && lngDifference < 0.01;
        return { candidate, score: textScore + (nearby ? 0.35 : 0), nearby };
      })
      .filter(({ score }) => score >= 0.35)
      .sort((left, right) => right.score - left.score)
      .slice(0, 5)
      .map(({ candidate, score, nearby }) => ({
        complaintId: candidate.complaintId,
        title: candidate.title,
        status: candidate.status,
        createdAt: candidate.createdAt,
        score: Math.round(score * 100),
        nearby,
      }));

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Find duplicate complaints error:', error);
    return NextResponse.json({ error: 'Failed to find duplicate complaints' }, { status: 500 });
  }
}
