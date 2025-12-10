import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  const { cookies } = req;

  const body = await req.json();

  const { tripId } = body;

  const accessToken = cookies.get('access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: 'Action not allowed' },
      { status: 401 },
    );
  }
  const { userId } = jwt.verify(
    accessToken,
    process.env?.ACCESS_TOKEN_SECRET ?? '',
  ) as { userId: number };
  try {
    const [[result]]: any = await pool.query('CALL toggle_favourite(?, ?)', [
      userId,
      tripId,
    ]);
    const response = result[0].action; // "added" or "removed"

    return NextResponse.json(
      { success: true, added: response === 'added' },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
