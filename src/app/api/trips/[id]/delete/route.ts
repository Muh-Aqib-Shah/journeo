import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import mysql from 'mysql2/promise';

// DELETE: Remove a trip
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

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
      // Check if trip exists and belongs to user
      const [rows]: any = await connection.query(
        'SELECT * FROM trips WHERE trip_id = ?',
        [tripId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: 'Trip not found', success: false },
          { status: 404 }
        );
      }

      const trip = rows[0];

      // Only allow deletion if user owns the trip
      if (trip.user_id !== user.id) {
        return NextResponse.json(
          { error: 'You can only delete your own trips', success: false },
          { status: 403 }
        );
      }

      // Delete related data (comments, itineraries, activities, favorites)
      await connection.query('DELETE FROM comment WHERE trip_id = ?', [tripId]);
      await connection.query('DELETE FROM itineraries WHERE trip_id = ?', [tripId]);
      await connection.query('DELETE FROM activity WHERE trip_id = ?', [tripId]);
      await connection.query('DELETE FROM favourite WHERE trip_id = ?', [tripId]);

      // Delete the trip
      await connection.query('DELETE FROM trips WHERE trip_id = ?', [tripId]);

      return NextResponse.json(
        { message: 'Trip deleted successfully', success: true },
        { status: 200 }
      );
    } finally {
      connection.end();
    }
  } catch (err: any) {
    console.error('Error deleting trip:', err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}
