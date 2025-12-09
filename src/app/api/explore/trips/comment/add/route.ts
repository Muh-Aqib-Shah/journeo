import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, comment } = body;

    if (!tripId || !comment) {
      return NextResponse.json(
        { success: false, error: 'tripId and comment_text are required' },
        { status: 400 },
      );
    }

    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const { userId } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET ?? '',
    ) as { userId: number };

    const [results]: any = await pool.query(
      'CALL add_comment_and_get_all(?, ?, ?)',
      [tripId, userId, comment],
    );

    const comments = results[0] ?? [];

    return NextResponse.json({ success: true, comments });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
