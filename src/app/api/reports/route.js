import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const revenue = await db.query(`SELECT RevenueYear, RevenueMonth, TotalRevenue FROM dbo.vw_MonthlyRevenue ORDER BY RevenueYear DESC, RevenueMonth DESC`);
    const logs = await db.query(`SELECT TOP 50 LogID, TableName, ActionType, ActionDate, Description FROM dbo.AuditLogs ORDER BY ActionDate DESC`);
    
    return NextResponse.json({ revenue, logs });
  } catch (error) {
    console.error('Reports GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
