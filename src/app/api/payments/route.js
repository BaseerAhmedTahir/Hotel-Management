import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payments = await db.query(`SELECT PaymentID, BookingID, GuestName, PaymentDate, Amount, PaymentMethod, PaymentStatus, BookingTotal FROM dbo.vw_PaymentReport ORDER BY PaymentDate DESC`);
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Payments GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { BookingID, Amount, PaymentMethod, PaymentStatus } = body;
    
    // Execute Stored Procedure
    await db.executeProc('dbo.sp_RecordPayment', {
      BookingID,
      Amount,
      PaymentMethod,
      PaymentStatus: PaymentStatus || 'Paid'
    });
    
    return NextResponse.json({ success: true, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Payments POST API Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to record payment' }, { status: 500 });
  }
}
