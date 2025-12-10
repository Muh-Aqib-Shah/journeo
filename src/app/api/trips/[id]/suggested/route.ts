import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

// GET: Fetch suggested trips (random trips from database)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || '6';
    const excludeTripId = searchParams.get('exclude');

    // console.log('=== SUGGESTED TRIPS API ===');
    // console.log('Limit:', limit);
    // console.log('Exclude trip ID:', excludeTripId);

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_NAME,
    });

    try {
      let query = `SELECT trip_id, user_id, destination, start_date, end_date, created_at 
                   FROM trips`;
      const params: any[] = [];

      // Exclude current trip if provided
      if (excludeTripId) {
        query += ` WHERE trip_id != ?`;
        params.push(excludeTripId);
      }

      query += ` ORDER BY RAND() LIMIT ?`;
      params.push(Number(limit));

      const [rows]: any = await connection.query(query, params);

      // console.log(`Fetched ${rows?.length || 0} suggested trips`);

      const trips = Array.isArray(rows) ? rows : [];
      return NextResponse.json({
        trips,
        success: true,
        totalCount: trips.length,
      });
    } finally {
      connection.end();
    }
  } catch (err: any) {
    // console.error('=== ERROR FETCHING SUGGESTED TRIPS ===');
    // console.error('Error message:', err.message);
    return NextResponse.json(
      { trips: [], error: err.message, success: false },
      { status: 500 },
    );
  }
}
