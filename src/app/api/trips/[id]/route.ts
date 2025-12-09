import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// GET: Fetch a specific trip by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tripId = params.id;

    if (!tripId) {
      return NextResponse.json(
        { error: 'tripId is required', success: false },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_NAME,
    });

    try {
      // Fetch trip details
      const [tripRows]: any = await connection.query(
        `SELECT trip_id, user_id, destination, start_date, end_date, created_at, updated_at
         FROM trips 
         WHERE trip_id = ?`,
        [tripId]
      );

      if (!Array.isArray(tripRows) || tripRows.length === 0) {
        return NextResponse.json(
          { trip: null, error: 'Trip not found', success: false },
          { status: 404 }
        );
      }

      const trip = tripRows[0];

      // Fetch itineraries for this trip
      const [itineraries]: any = await connection.query(
        `SELECT * FROM itineraries WHERE trip_id = ? ORDER BY day ASC`,
        [tripId]
      );

      // Fetch comments for this trip
      const [comments]: any = await connection.query(
        `SELECT comment_id, user_id, trip_id, comment_text, created_at
         FROM comment 
         WHERE trip_id = ? 
         ORDER BY created_at DESC`,
        [tripId]
      );

      return NextResponse.json({
        trip: {
          ...trip,
          itineraries: itineraries || [],
          comments: comments || [],
        },
        success: true,
      });
    } finally {
      connection.end();
    }
  } catch (err: any) {
    console.error('Error fetching trip:', err);
    return NextResponse.json(
      { trip: null, error: err.message, success: false },
      { status: 500 }
    );
  }
}
