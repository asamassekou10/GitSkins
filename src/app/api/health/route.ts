import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let dbOk = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    // db unavailable
  }

  return NextResponse.json(
    { ok: true, db: dbOk, timestamp: new Date().toISOString() },
    { status: dbOk ? 200 : 503 }
  );
}
