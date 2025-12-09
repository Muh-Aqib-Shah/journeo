import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  const { cookies } = req;
  const accessToken = cookies.get('access_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: 'Action not allowed' },
      { status: 400 },
    );
  }
  const { userId } = jwt.verify(
    accessToken,
    process.env?.ACCESS_TOKEN_SECRET ?? '',
  ) as { userId: number };
  try {
    const [rows] = await pool.query(
      `SELECT * FROM trips WHERE user_id=${userId}`,
    );
    return Response.json({ data: rows, ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
