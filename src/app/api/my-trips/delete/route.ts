import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { tripId } = body;

    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'No username or access token provided' },
        { status: 401 },
      );
    }

    const { userId } = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET || '',
    ) as { userId: number };

    await pool.query('DELETE FROM trips WHERE trip_id = ? AND user_id = ?', [
      tripId,
      userId,
    ]);

    return NextResponse.json(
      { message: 'Trip Removed successfully' },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
