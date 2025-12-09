import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import mysql from 'mysql2/promise';

// GET: Fetch all comments for a trip
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');
    const seedData = searchParams.get('seed') === 'true';

    console.log('=== COMMENTS API GET ===');
    console.log('Received tripId:', tripId);
    console.log('Seed data mode:', seedData);

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_NAME,
    });

    try {
      // Seed test data if requested
      if (seedData) {
        console.log('Seeding test comments...');
        
        // Check if data already exists
        const [existing]: any = await connection.query('SELECT COUNT(*) as count FROM comment');
        
        if (existing[0].count === 0) {
          // First, check if trip with ID 1 exists
          const [tripExists]: any = await connection.query('SELECT trip_id FROM trips WHERE trip_id = 1');
          
          if (tripExists.length === 0) {
            // Create a test trip if it doesn't exist
            console.log('Creating test trip...');
            await connection.query(
              `INSERT INTO trips (trip_id, user_id, destination, start_date, end_date, created_at) 
               VALUES (1, 1, 'Paris, France', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NOW())`
            );
          }
          
          // Insert test comments
          await connection.query(
            `INSERT INTO comment (trip_id, user_id, comment_text, created_at) VALUES 
            (?, ?, ?, NOW()),
            (?, ?, ?, NOW()),
            (?, ?, ?, NOW())`,
            [
              1, 1, 'Great trip! Loved every moment.',
              1, 2, 'Amazing experience, would recommend!',
              1, 3, 'Perfect itinerary and great guides.'
            ]
          );
          console.log('Test data seeded successfully');
        }
        
        const [rows]: any = await connection.query(
          `SELECT comment_id, user_id, trip_id, comment_text, created_at, updated_at
           FROM comment 
           ORDER BY created_at DESC`
        );

        return NextResponse.json({ 
          comments: rows || [], 
          success: true, 
          seeded: true,
          totalCount: rows?.length || 0 
        });
      }

      // Normal flow: fetch comments for specific tripId
      if (!tripId) {
        return NextResponse.json(
          { comments: [], error: 'tripId is required' },
          { status: 400 }
        );
      }

      const [rows]: any = await connection.query(
        `SELECT comment_id, user_id, trip_id, comment_text, created_at, updated_at
         FROM comment 
         WHERE trip_id = ? 
         ORDER BY created_at DESC`,
        [tripId]
      );

      console.log(`Query executed for tripId: ${tripId}, rows returned: ${rows?.length || 0}`);

      const comments = Array.isArray(rows) ? rows : [];
      return NextResponse.json({ 
        comments, 
        success: true, 
        debug: { tripId, rowCount: comments.length } 
      });
    } finally {
      connection.end();
    }
  } catch (err: any) {
    console.error('=== ERROR IN GET ===');
    console.error('Error message:', err.message);
    return NextResponse.json(
      { comments: [], error: err.message, success: false },
      { status: 500 }
    );
  }
}



// POST: Add a new comment
export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { comment: null, error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { tripId, content } = body;

    if (!tripId || !content) {
      return NextResponse.json(
        { comment: null, error: 'tripId and content are required', success: false },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { comment: null, error: 'Comment content cannot be empty', success: false },
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
      const [result]: any = await connection.query(
        'INSERT INTO comment (trip_id, user_id, comment_text) VALUES (?, ?, ?)',
        [tripId, user.id, content.trim()]
      );

      // Fetch the newly created comment
      const [rows]: any = await connection.query(
        `SELECT comment_id, user_id, trip_id, comment_text, created_at, updated_at
         FROM comment 
         WHERE comment_id = ?`,
        [result.insertId]
      );

      const comment = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
      return NextResponse.json({ comment, success: true }, { status: 201 });
    } finally {
      connection.end();
    }
  } catch (err: any) {
    console.error('Error creating comment:', err);
    return NextResponse.json(
      { comment: null, error: err.message, success: false },
      { status: 500 }
    );
  }
}

// DELETE: Remove a comment
export async function DELETE(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required', success: false },
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
      // Check if comment exists and belongs to user
      const [rows]: any = await connection.query(
        'SELECT * FROM comment WHERE comment_id = ?',
        [commentId]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: 'Comment not found', success: false },
          { status: 404 }
        );
      }

      const comment = rows[0];

      // Only allow deletion if user owns the comment
      if (comment.user_id !== user.id) {
        return NextResponse.json(
          { error: 'You can only delete your own comments', success: false },
          { status: 403 }
        );
      }

      await connection.query('DELETE FROM comment WHERE comment_id = ?', [commentId]);

      return NextResponse.json(
        { message: 'Comment deleted successfully', success: true },
        { status: 200 }
      );
    } finally {
      connection.end();
    }
  } catch (err: any) {
    console.error('Error deleting comment:', err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}