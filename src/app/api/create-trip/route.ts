import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';
import type { CreateTripType } from '@/lib/types/create-trip';

export async function POST(req: NextRequest) {
  try {
    const { cookies } = req;
    const body = await req.json();

    const tripData: CreateTripType = body;
    const { name, destination, description, duration, visibility, iteinary } =
      tripData;

    const startDate = new Date(duration.from).toISOString().split('T')[0];
    const endDate = new Date(duration.to).toISOString().split('T')[0];

    const itineraryJson = JSON.stringify(
      iteinary.map((day) => {
        return {
          day: day.day,
          date: new Date(day.date).toISOString().split('T')[0], // 'YYYY-MM-DD'
          activities: day.activities.map((act) => ({
            name: act.name,
            description: act.description,
            pictures: act.pictures,
            price: {
              amount: act.price.amount,
              currencyCode: act.price.currencyCode,
            },
            latitude: (act as any).geoCode.latitude || null,
            longitude: (act as any).geoCode.longitude || null,
            minimumDuration: act.minimumDuration,
          })),
        };
      }),
    );

    const accessToken = cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Action not allowed' },
        { status: 400 },
      );
    }

    const { userId } = jwt.verify(
      accessToken,
      process.env?.ACCESS_TOKEN_SECRET ?? '',
    ) as { userId: number };
    const conn = await pool.getConnection();

    try {
      await conn.query('CALL create_trip_with_data(?, ?, ?, ?, ?, ?, ?, ?)', [
        userId,
        name,
        description,
        destination,
        startDate,
        endDate,
        visibility,
        itineraryJson,
      ]);
    } finally {
      conn.release();
    }

    return NextResponse.json(
      { success: true, message: 'Trip created successfully' },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Unknown error' },
      { status: 400 },
    );
  }
}
