import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 },
      );
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    const user = (rows as any)[0];
    if (!user)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 },
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 },
      );

    const accessToken = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '60m' },
    );

    const refreshToken = jwt.sign(
      { userId: user.user_id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' },
    );

    await pool.query('UPDATE users SET refresh_token = ? WHERE user_id = ?', [
      refreshToken,
      user.user_id,
    ]);

    const accessCookie = serialize('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 15 * 60, // 15 minutes
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    const refreshCookie = serialize('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    const response = NextResponse.json(
      { accessToken, message: 'Logged in successfully' },
      { status: 200 },
    );
    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

/* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJlbWFpbCI6ImFxaWIxMDFAZ21haWwuY29tIiwiaWF0IjoxNzY1MTEwMzkxLCJleHAiOjE3NjUxMTEyOTF9.QU1sRGMtagx9VE6Lq9mRpLX27qC77tjmkFO-
gFs8QXY
*/

/* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJlbWFpbCI6ImFxaWIxMDFAZ21haWwuY29tIiwiaWF0IjoxNzY1MTEwMzkxLCJleHAiOjE3NjUxMTEyOTF9.QU1sRGMtagx9VE6Lq9mRpLX27qC77tjmkFO-
gFs8QXY
*/
