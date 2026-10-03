import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Complaint, ComplaintCategory, ComplaintStatus, Stats } from '@/types';

export async function GET() {
  try {
    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [total, resolved, thisWeek, allComplaints] = await Promise.all([
      complaintsCollection.countDocuments(),
      complaintsCollection.countDocuments({ status: 'RESOLVED' }),
      complaintsCollection.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      complaintsCollection.find({}).toArray(),
    ]);

    const open = total - resolved;

    const byCategory: Record<ComplaintCategory, number> = {
      WATER_SUPPLY: 0,
      ADMINISTRATION: 0,
      WATER_SUPPLY_SEWAGE: 0,
      POLLUTION_CONTROL: 0,
      MUNICIPAL_CIVIC: 0,
      ROADS: 0,
      GARBAGE: 0,
      DRAINAGE: 0,
      SEWERAGE: 0,
      STREETLIGHTS: 0,
      PARKS: 0,
      POLLUTION: 0,
      ILLEGAL_DUMPING: 0,
      PUBLIC_TOILETS: 0,
      STRAY_ANIMALS: 0,
      OTHER: 0,
    };

    const byStatus: Record<ComplaintStatus, number> = {
      SUBMITTED: 0,
      VERIFIED: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REOPENED: 0,
      REJECTED: 0,
      DUPLICATE: 0,
    };

    allComplaints.forEach((complaint) => {
      byCategory[complaint.category]++;
      byStatus[complaint.status]++;
    });

    const stats: Stats = {
      total,
      open,
      resolved,
      thisWeek,
      byCategory,
      byStatus,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
