import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const tripId = searchParams.get('id');

  if (!tripId) {
    return NextResponse.json({ error: 'Trip ID is required' }, { status: 401 });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT c.comment_id, c.comment_text, c.created_at,
             u.username
      FROM comment c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.trip_id = ?
      ORDER BY c.created_at DESC
      `,
      [tripId],
    );

    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}
