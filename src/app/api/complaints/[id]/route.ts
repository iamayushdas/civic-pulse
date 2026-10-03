import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Complaint } from '@/types';
import { updateComplaintStatusSchema } from '@/lib/validations/complaint';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');

    const complaint = await complaintsCollection.findOne({
      complaintId: id,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    await complaintsCollection.updateOne(
      { complaintId: id },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = updateComplaintStatusSchema.parse(body);

    const db = await getDb();
    const complaintsCollection = db.collection<Complaint>('complaints');

    const complaint = await complaintsCollection.findOne({
      complaintId: id,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    if (validatedData.assignedTo) updateData.assignedTo = validatedData.assignedTo;
    if (validatedData.department) updateData.department = validatedData.department;
    if (validatedData.priority) updateData.priority = validatedData.priority;
    if (validatedData.resolutionNote) updateData.resolutionNote = validatedData.resolutionNote;
    if (validatedData.resolutionImages) updateData.resolutionImages = validatedData.resolutionImages;

    const statusHistoryEntry = {
      status: validatedData.status,
      timestamp: new Date(),
      note: validatedData.note,
    };

    await complaintsCollection.updateOne(
      { complaintId: id },
      {
        $set: updateData,
        $push: { statusHistory: statusHistoryEntry },
      }
    );

    const updatedComplaint = await complaintsCollection.findOne({
      complaintId: id,
    });

    return NextResponse.json(updatedComplaint);
  } catch (error: any) {
    console.error('Update complaint error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}
