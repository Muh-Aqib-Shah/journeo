import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = Number(searchParams.get('id'));

    if (!tripId || !tripId) {
      return NextResponse.json(
        { success: false, error: 'trip_id is required' },
        { status: 400 },
      );
    }

    const [rows]: any = await pool.query(`CALL suggested_trips(?);`, [tripId]);

    const results = rows[0] ?? [];
    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, data: null, error: err.message },
      { status: 500 },
    );
  }
}
