import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }
    const payload: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    );

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE user_id = ? AND refresh_token = ?',
      [payload.userId, refreshToken],
    );
    const user = (rows as any)[0];
    if (!user)
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 },
      );

    const accessToken = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '60m' },
    );

    return NextResponse.json(
      { accessToken },
      {
        status: 200,
        headers: {
          'Set-Cookie': `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Strict`,
        },
      },
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
