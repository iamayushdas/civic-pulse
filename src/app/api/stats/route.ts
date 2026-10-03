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

    const departmentMap = new Map<string, { total: number; resolved: number; resolutionHours: number[] }>();
    const wardMap = new Map<string, number>();
    let overdue = 0;

    allComplaints.forEach((complaint) => {
      const department = complaint.department || 'UNASSIGNED';
      const departmentStats = departmentMap.get(department) || { total: 0, resolved: 0, resolutionHours: [] };
      departmentStats.total += 1;
      if (complaint.status === 'RESOLVED') {
        departmentStats.resolved += 1;
        const resolvedEntry = complaint.statusHistory?.find((entry) => entry.status === 'RESOLVED');
        const resolvedAt = resolvedEntry ? new Date(resolvedEntry.timestamp).getTime() : 0;
        const createdAt = new Date(complaint.createdAt).getTime();
        if (resolvedAt > createdAt) departmentStats.resolutionHours.push((resolvedAt - createdAt) / 3600000);
      }
      departmentMap.set(department, departmentStats);
      const ward = complaint.ward || 'UNKNOWN';
      wardMap.set(ward, (wardMap.get(ward) || 0) + 1);
      if (complaint.slaDueAt && new Date(complaint.slaDueAt) < new Date() && !['RESOLVED', 'REJECTED', 'DUPLICATE'].includes(complaint.status)) overdue += 1;
    });

    const stats: Stats & { overdue: number; byWard: Record<string, number>; departmentPerformance: Array<Record<string, number | string>> } = {
      total,
      open,
      resolved,
      thisWeek,
      byCategory,
      byStatus,
      overdue,
      byWard: Object.fromEntries(wardMap),
      departmentPerformance: Array.from(departmentMap.entries()).map(([department, values]) => ({
        department,
        total: values.total,
        resolved: values.resolved,
        resolutionRate: values.total ? Math.round((values.resolved / values.total) * 100) : 0,
        averageResolutionHours: values.resolutionHours.length
          ? Math.round(values.resolutionHours.reduce((sum, hours) => sum + hours, 0) / values.resolutionHours.length)
          : 0,
      })).sort((left, right) => Number(right.total) - Number(left.total)),
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
