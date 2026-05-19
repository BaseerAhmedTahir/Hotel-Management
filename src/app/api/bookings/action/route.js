import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, BookingID } = body;
    
    let procName = '';
    if (action === 'cancel') procName = 'dbo.sp_CancelBooking';
    else if (action === 'checkin') procName = 'dbo.sp_CheckInBooking';
    else if (action === 'checkout') procName = 'dbo.sp_CheckOutBooking';
    else return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    await db.executeProc(procName, { BookingID });
    
    return NextResponse.json({ success: true, message: `Booking ${action} successful` });
  } catch (error) {
    console.error('Booking Action API Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update booking' }, { status: 500 });
  }
}
