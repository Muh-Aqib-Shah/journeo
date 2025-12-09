import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const { cookies } = req;
    const accessToken = cookies.get('access_token')?.value;

    if (!accessToken) {
      const response = NextResponse.json(
        { message: 'Logged out' },
        { status: 200 },
      );
      response.headers.append(
        'Set-Cookie',
        serialize('access_token', '', { path: '/', maxAge: 0 }),
      );
      response.headers.append(
        'Set-Cookie',
        serialize('refresh_token', '', { path: '/', maxAge: 0 }),
      );
      return response;
    }

    const decoded: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
    );
    const { userId } = decoded;

    await pool.query(
      'UPDATE users SET refresh_token = NULL WHERE user_id = ?',
      [userId],
    );

    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 },
    );
    response.headers.append(
      'Set-Cookie',
      serialize('access_token', '', { path: '/', maxAge: 0 }),
    );
    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', '', { path: '/', maxAge: 0 }),
    );

    return response;
  } catch (err) {
    const response = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 },
    );
    response.headers.append(
      'Set-Cookie',
      serialize('access_token', '', { path: '/', maxAge: 0 }),
    );
    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', '', { path: '/', maxAge: 0 }),
    );
    return response;
  }
}
