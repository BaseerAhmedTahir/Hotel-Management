import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Select from the view provided in the assignment
    const rooms = await db.query(`SELECT RoomID, RoomNumber, TypeName, BasePrice, MaxOccupancy, FloorNo, Status FROM dbo.vw_AvailableRooms`);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Rooms GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
