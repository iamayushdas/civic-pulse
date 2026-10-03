import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pincode: string }> }
) {
  try {
    const { pincode } = await params;
    
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode format' },
        { status: 400 }
      );
    }

    const { getIndiaPincode } = await import('india-pincode/browser');
    const pin = await getIndiaPincode();
    
    const result = pin.getByPincode(pincode);
    
    if (!result.success || !result.data || result.data.data.length === 0) {
      return NextResponse.json(
        { error: 'Pincode not found' },
        { status: 404 }
      );
    }

    const office = result.data.data[0];
    
    return NextResponse.json({
      pincode: office.pincode,
      area: office.area,
      ward: office.district,
      state: office.state,
      district: office.district,
      coordinates: office.latitude && office.longitude ? [office.latitude, office.longitude] : null,
      allOffices: result.data.data.map(o => ({
        name: o.area,
        officeType: o.officeType,
        district: o.district,
        state: o.state,
      })),
    });
  } catch (error) {
    console.error('Pincode lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup pincode' },
      { status: 500 }
    );
  }
}