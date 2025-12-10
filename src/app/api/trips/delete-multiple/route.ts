import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function POST(req: NextRequest) {
  try {
    // Get user from JWT token
    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || '',
      ) as { userId: number };
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { tripIds } = body;

    if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
      return NextResponse.json(
        { message: 'No trip IDs provided' },
        { status: 400 },
      );
    }

    // Verify ownership of all trips
    const placeholders = tripIds.map(() => '?').join(',');
    const [trips] = await pool.query(
      `SELECT trip_id FROM trips WHERE trip_id IN (${placeholders}) AND user_id = ?`,
      [...tripIds, userId],
    );

    const ownedTripIds = (trips as any[]).map((t: any) => t.trip_id);

    if (ownedTripIds.length !== tripIds.length) {
      return NextResponse.json(
        { message: 'Some trips do not belong to you' },
        { status: 403 },
      );
    }

    // Delete in order of dependencies
    const placeholdersForDelete = ownedTripIds.map(() => '?').join(',');

    // Delete comments
    await pool.query(
      `DELETE FROM comment WHERE trip_id IN (${placeholdersForDelete})`,
      ownedTripIds,
    );

    // Delete activities
    await pool.query(
      `DELETE FROM activity WHERE itinerary_id IN (
        SELECT itinerary_id FROM itineraries WHERE trip_id IN (${placeholdersForDelete})
      )`,
      ownedTripIds,
    );

    // Delete itineraries
    await pool.query(
      `DELETE FROM itineraries WHERE trip_id IN (${placeholdersForDelete})`,
      ownedTripIds,
    );

    // Delete favorites
    await pool.query(
      `DELETE FROM favourite WHERE trip_id IN (${placeholdersForDelete})`,
      ownedTripIds,
    );

    // Delete trips
    await pool.query(
      `DELETE FROM trips WHERE trip_id IN (${placeholdersForDelete})`,
      ownedTripIds,
    );

    return NextResponse.json(
      {
        message: `${ownedTripIds.length} trip(s) deleted successfully`,
        deletedCount: ownedTripIds.length,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Delete multiple trips error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error: String(err) },
      { status: 500 },
    );
  }
}

// GET to fetch user's trips
export async function GET(req: NextRequest) {
  try {
    // Get user from JWT token
    const accessToken = req.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || '',
      ) as { userId: number };
      userId = decoded.userId;
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const [trips] = await pool.query(
      'SELECT trip_id, destination, start_date, end_date FROM trips WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
    );

    return NextResponse.json({ trips, success: true }, { status: 200 });
  } catch (err) {
    console.error('Fetch trips error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error: String(err) },
      { status: 500 },
    );
  }
}
