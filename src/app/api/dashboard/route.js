import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const totalRooms = await db.query(`SELECT COUNT(*) as count FROM dbo.Rooms`);
    const availableRooms = await db.query(`SELECT COUNT(*) as count FROM dbo.vw_AvailableRooms`);
    const guests = await db.query(`SELECT COUNT(*) as count FROM dbo.Guests`);
    const bookings = await db.query(`SELECT COUNT(*) as count FROM dbo.Bookings`);
    const revenue = await db.query(`SELECT SUM(Amount) as total FROM dbo.Payments WHERE PaymentStatus = 'Paid'`);

    return NextResponse.json({
      totalRooms: totalRooms[0]?.count || 0,
      availableRooms: availableRooms[0]?.count || 0,
      guests: guests[0]?.count || 0,
      bookings: bookings[0]?.count || 0,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
