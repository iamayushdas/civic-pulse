import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Complaint } from '@/types';
import { createComplaintSchema, complaintQuerySchema } from '@/lib/validations/complaint';
import { generateComplaintId, getSlaDueAt } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createComplaintSchema.parse(body);

    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');

    const createdAt = new Date();
    const complaint: Complaint = {
      complaintId: generateComplaintId(),
      category: validatedData.category,
      subCategory: validatedData.subCategory,
      title: validatedData.title,
      description: validatedData.description,
      images: validatedData.images,
      location: validatedData.location,
      area: validatedData.area,
      ward: validatedData.ward,
      pincode: validatedData.pincode,
      status: 'SUBMITTED',
      priority: 'MEDIUM',
      createdAt,
      updatedAt: createdAt,
      slaDueAt: getSlaDueAt(createdAt, 'MEDIUM'),
      confirmationCount: 0,
      confirmationKeys: [],
      anonymous: validatedData.anonymous,
      citizenName: validatedData.citizenName,
      citizenPhone: validatedData.citizenPhone,
      citizenEmail: validatedData.citizenEmail,
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: new Date(),
          note: 'Complaint submitted',
        },
      ],
      viewCount: 0,
    };

    const result = await complaintsCollection.insertOne(complaint as any);
    
    return NextResponse.json({
      success: true,
      complaintId: complaint.complaintId,
      id: result.insertedId,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create complaint error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const validatedQuery = complaintQuerySchema.parse(queryParams);

    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');

    const filter: any[] = [
      { complaintId: { $exists: true, $ne: null } },
      { status: { $exists: true, $ne: null } },
      { title: { $exists: true, $ne: null } },
      { category: { $exists: true, $ne: null } },
    ];

    if (validatedQuery.category) filter.push({ category: validatedQuery.category });
    if (validatedQuery.status) filter.push({ status: validatedQuery.status });
    if (validatedQuery.area) filter.push({ area: { $regex: validatedQuery.area, $options: 'i' } });
    if (validatedQuery.ward) filter.push({ ward: validatedQuery.ward });
    if (validatedQuery.pincode) filter.push({ pincode: validatedQuery.pincode });
    if (validatedQuery.department) filter.push({ department: validatedQuery.department });
    if (validatedQuery.assignedTo) filter.push({ assignedTo: { $regex: validatedQuery.assignedTo, $options: 'i' } });
    if (validatedQuery.priority) filter.push({ priority: validatedQuery.priority });
    if (validatedQuery.overdue === 'true') {
      filter.push({
        slaDueAt: { $lt: new Date() },
        status: { $nin: ['RESOLVED', 'REJECTED', 'DUPLICATE'] },
      });
    }
    if (validatedQuery.q) {
      const search = { $regex: validatedQuery.q, $options: 'i' };
      filter.push({ $or: [{ complaintId: search }, { title: search }, { description: search }, { area: search }] });
    }

    const mongoFilter: Record<string, any> = { $and: filter };

    if (validatedQuery.fromDate || validatedQuery.toDate) {
      mongoFilter.createdAt = {};
      if (validatedQuery.fromDate) {
        mongoFilter.createdAt.$gte = new Date(validatedQuery.fromDate);
      }
      if (validatedQuery.toDate) {
        mongoFilter.createdAt.$lte = new Date(validatedQuery.toDate);
      }
    }

    const page = parseInt(validatedQuery.page || '1');
    const limit = parseInt(validatedQuery.limit || '20');
    const skip = (page - 1) * limit;

    const sortBy = validatedQuery.sortBy || 'createdAt';
    const sortOrder = validatedQuery.sortOrder === 'asc' ? 1 : -1;

    const [complaints, total] = await Promise.all([
      complaintsCollection
        .find(mongoFilter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray(),
      complaintsCollection.countDocuments(mongoFilter),
    ]);

    return NextResponse.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get complaints error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
