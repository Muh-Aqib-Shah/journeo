import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let username = url.searchParams.get('username');
    const tripId = url.searchParams.get('id');

    if (username === 'null') {
      const accessToken = req.cookies.get('access_token')?.value;
      if (!accessToken) {
        return NextResponse.json(
          { success: false, error: 'No username or access token provided' },
          { status: 401 },
        );
      }

      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || '',
      ) as { userId: number };
      const [userRows] = await pool.query(
        'SELECT username FROM user_id_to_username WHERE user_id = ?',
        [decoded.userId],
      );

      if (Array.isArray(userRows) && userRows.length > 0) {
        username = (userRows[0] as any).username;
      } else {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 },
        );
      }
    }

    const [rows] = await pool.query(
      'CALL get_itinerary_with_activities_by_username(?, ?)',
      [username, tripId],
    );
    const flatData: any = Array.isArray(rows) ? rows[0] : [];

    if (!flatData || flatData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 },
      );
    }

    const tripInfo = {
      id: flatData[0].trip_id,
      name: flatData[0].trip_name,
      cover_img: flatData[0].trip_cover_image,
      destination: flatData[0].destination,
      total_days: flatData[0].total_days,
      budget_estimate: flatData[0].budget_estimate,
      iteinary: [] as any[],
    };

    const dayMap = new Map<number, any>();

    flatData.forEach((row: any) => {
      if (!dayMap.has(row.day_number)) {
        dayMap.set(row.day_number, {
          day: row.day_number,
          date: row.itinerary_date,
          activities: [],
        });
      }

      if (row.activity_id) {
        dayMap.get(row.day_number).activities.push({
          name: row.activity_name,
          description: row.activity_description,
          picture: row.cover_img,
          minimumDuration: row.minimumDuration,
          price: {
            amount: row.estimated_cost ?? 0,
            currencyCode: 'EUR',
          },
          geoCode: {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
          },
        });
      }
    });

    tripInfo.iteinary = Array.from(dayMap.values());

    return NextResponse.json({ success: true, data: tripInfo });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
