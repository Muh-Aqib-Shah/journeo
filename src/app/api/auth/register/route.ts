import bcrypt from 'bcrypt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 },
      );
    }

    const [rows] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email],
    );
    if ((rows as any).length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password, username, created_at) VALUES (?, ?, ?, NOW())',
      [email, passwordHash, username],
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
