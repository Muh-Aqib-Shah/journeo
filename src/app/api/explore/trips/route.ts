import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  const { cookies } = req;
  const accessToken = cookies.get('access_token')?.value;

  let userId = null;

  if (accessToken) {
    const decoded = jwt.verify(
      accessToken || '',
      process.env?.ACCESS_TOKEN_SECRET ?? '',
    ) as { userId: number };
    userId = decoded.userId;
  }

  try {
    const [rows] = await pool.query(`
    SELECT 
      u.username,
      t.*,
      COUNT(DISTINCT f.favourite_id) AS likes,
      COUNT(DISTINCT c.comment_id) AS comment_count,
      (MAX(f_user.favourite_id IS NOT NULL) = 1) AS isLiked
    FROM trips t
    INNER JOIN users u ON t.user_id = u.user_id
    LEFT JOIN favourite f ON t.trip_id = f.trip_id
    LEFT JOIN comment c ON t.trip_id = c.trip_id
    LEFT JOIN favourite f_user ON f_user.user_id = ${accessToken ? userId : -1} and f_user.trip_id = t.trip_id 
    WHERE t.is_public = TRUE
    GROUP BY 
        t.trip_id
`);
    return NextResponse.json({ data: rows, ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: err.message },
      { status: 500 },
    );
  }
}
