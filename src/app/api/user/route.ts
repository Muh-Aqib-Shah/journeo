import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  const { cookies } = req;
  const accessToken = cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, error: 'User not Logged In' },
      { status: 400 },
    );
  }
  const { userId } = jwt.verify(
    accessToken,
    process.env?.ACCESS_TOKEN_SECRET ?? '',
  ) as { userId: number };

  try {
    const [rows]: any = await pool.query(
      `SELECT user_id, username, email FROM users WHERE user_id=${userId}`,
    );
    const user = rows[0];

    return Response.json({ ...user }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 },
    );
  }
}
