import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await db.query(`SELECT BookingID, GuestName, Phone, Email, CreatedByEmployee, BookingDate, CheckInDate, CheckOutDate, Status, TotalAmount, TotalRooms FROM dbo.vw_BookingSummary ORDER BY BookingID DESC`);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { GuestID, RoomID, CheckInDate, CheckOutDate } = body;
    
    // Execute Stored Procedure
    const result = await db.executeProc('dbo.sp_CreateBooking', {
      GuestID,
      EmployeeID: 2, // Hardcoded to employee 2 (Sana Malik, Receptionist) for simplicity
      RoomID,
      CheckInDate,
      CheckOutDate
    });
    
    return NextResponse.json({ success: true, message: 'Booking created successfully', result });
  } catch (error) {
    console.error('Bookings POST API Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create booking' }, { status: 500 });
  }
}
