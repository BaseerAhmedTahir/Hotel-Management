import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const guests = await db.query(`SELECT GuestID, FullName, Email, Phone, CNICOrPassport, Address FROM dbo.Guests ORDER BY GuestID DESC`);
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Guests GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { FullName, Email, Phone, CNICOrPassport, Address } = body;
    
    // Execute Stored Procedure
    await db.executeProc('dbo.sp_AddGuest', {
      FullName,
      Email,
      Phone,
      CNICOrPassport,
      Address: Address || null
    });
    
    return NextResponse.json({ success: true, message: 'Guest added successfully' });
  } catch (error) {
    console.error('Guests POST API Error:', error);
    return NextResponse.json({ error: 'Failed to add guest' }, { status: 500 });
  }
}
