import { NextResponse } from 'next/server';

import pool from '@/lib/db';

export async function GET() {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    const [trips] = await pool.query('SELECT * FROM trips');
    return NextResponse.json({
      success: true,
      users,
      trips,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
