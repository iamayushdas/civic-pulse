import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { MLACollection, MLAModel } from '@/models/MLA';
import { DepartmentHeadCollection, DepartmentHeadModel } from '@/models/DepartmentHead';
import { ComplaintCategory, Representative } from '@/types';

const DEPARTMENT_CATEGORY_BY_COMPLAINT: Partial<Record<ComplaintCategory, ComplaintCategory>> = {
  WATER_SUPPLY: 'WATER_SUPPLY_SEWAGE',
  DRAINAGE: 'WATER_SUPPLY_SEWAGE',
  SEWERAGE: 'WATER_SUPPLY_SEWAGE',
  ROADS: 'MUNICIPAL_CIVIC',
  GARBAGE: 'MUNICIPAL_CIVIC',
  STREETLIGHTS: 'MUNICIPAL_CIVIC',
  PARKS: 'MUNICIPAL_CIVIC',
  PUBLIC_TOILETS: 'MUNICIPAL_CIVIC',
  STRAY_ANIMALS: 'MUNICIPAL_CIVIC',
  POLLUTION: 'POLLUTION_CONTROL',
  ILLEGAL_DUMPING: 'POLLUTION_CONTROL',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pincode: string }> }
) {
  try {
    const { pincode } = await params;
    const complaintCategory = request.nextUrl.searchParams.get('category') as ComplaintCategory | null;
    
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode format' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const mlaCollection = db.collection<MLAModel>(MLACollection);
    const deptHeadCollection = db.collection<DepartmentHeadModel>(DepartmentHeadCollection);

    // Fetch MLA for this pincode
    const mla = await mlaCollection.findOne({
      pincodes: pincode,
      isActive: true,
    });

    // Department heads represent Delhi-wide authorities, so their office pincode
    // should not limit which complaints can find them.
    const departmentCategory = complaintCategory
      ? DEPARTMENT_CATEGORY_BY_COMPLAINT[complaintCategory]
      : undefined;
    const departmentHeads = await deptHeadCollection.find({
      state: 'Delhi',
      isActive: true,
      ...(departmentCategory ? { departmentCategory } : {}),
    }).toArray();

    const representatives: Representative[] = [];

    // Add MLA
    if (mla) {
      representatives.push({
        type: 'MLA',
        name: mla.name,
        designation: `MLA - ${mla.constituency}`,
        party: mla.party,
        phone: mla.phone,
        email: mla.email,
        address: mla.address,
        photoUrl: mla.photoUrl,
        jurisdiction: mla.constituency,
        pincode: pincode,
        area: mla.constituency,
      });
    }

    // Add Department Heads
    for (const dept of departmentHeads) {
      representatives.push({
        type: 'DEPARTMENT_HEAD',
        name: dept.name,
        designation: dept.designation,
        department: dept.department,
        phone: dept.phone,
        email: dept.email,
        address: dept.officeAddress,
        photoUrl: dept.photoUrl,
        jurisdiction: dept.jurisdiction || dept.department,
        pincode: dept.pincode,
        area: dept.city || dept.district,
        ward: dept.ward,
      });
    }

    return NextResponse.json({
      pincode,
      representatives,
      total: representatives.length,
    });
  } catch (error) {
    console.error('Fetch representatives error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representatives' },
      { status: 500 }
    );
  }
}