import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);
    const excludeId = url.searchParams.get('exclude');

    let query =
      'SELECT trip_id, destination, total_days FROM trips ORDER BY RAND() LIMIT ?';
    const params: any[] = [limit];

    if (excludeId) {
      query =
        'SELECT trip_id, destination, total_days FROM trips WHERE trip_id != ? ORDER BY RAND() LIMIT ?';
      params.unshift(parseInt(excludeId, 10));
    }

    const [trips] = await pool.query(query, params);

    console.log('Suggested trips query result:', trips);

    return NextResponse.json(
      {
        trips: trips || [],
        success: true,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Suggested trips error:', err);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: String(err),
        success: false,
      },
      { status: 500 },
    );
  }
}
