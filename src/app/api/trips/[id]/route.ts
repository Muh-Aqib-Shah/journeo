import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { pool } from '@/db/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const tripId = parseInt(params.id, 10);

    // Get trip details
    const [tripRows] = await pool.query(
      'SELECT * FROM trips WHERE trip_id = ?',
      [tripId],
    );

    if (!Array.isArray(tripRows) || tripRows.length === 0) {
      return NextResponse.json(
        { message: 'Trip not found', success: false },
        { status: 404 },
      );
    }

    const trip = (tripRows as any)[0];

    // Get itineraries with activities
    const [itineraryRows] = await pool.query(
      `SELECT 
        i.itinerary_id,
        i.trip_id,
        i.day,
        i.itinerary_date,
        a.activity_id,
        a.activity_name,
        a.description,
        a.location,
        a.latitude,
        a.longitude,
        a.estimated_cost,
        a.duration
       FROM itineraries i
       LEFT JOIN activity a ON i.itinerary_id = a.itinerary_id
       WHERE i.trip_id = ?
       ORDER BY i.day ASC`,
      [tripId],
    );

    // Get comments
    const [commentRows] = await pool.query(
      'SELECT * FROM comment WHERE trip_id = ? ORDER BY created_at DESC',
      [tripId],
    );

    // Transform data
    const itinerariesMap = new Map<number, any>();

    if (Array.isArray(itineraryRows)) {
      itineraryRows.forEach((row: any) => {
        if (!itinerariesMap.has(row.itinerary_id)) {
          itinerariesMap.set(row.itinerary_id, {
            itinerary_id: row.itinerary_id,
            day: row.day || 1,
            itinerary_date: row.itinerary_date,
            activities: [],
          });
        }

        if (row.activity_id) {
          itinerariesMap.get(row.itinerary_id).activities.push({
            activity_id: row.activity_id,
            name: row.activity_name,
            description: row.description || '',
            location: row.location || '',
            geoCode: {
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0,
            },
            price: {
              amount: row.estimated_cost || 0,
              currencyCode: 'EUR',
            },
            minimumDuration: row.duration || '',
            picture: '',
          });
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        trip: {
          trip_id: trip.trip_id,
          destination: trip.destination,
          cover_image: trip.cover_image || '',
          budget_estimate: trip.budget_estimate || '',
          total_days: trip.total_days || 1,
        },
        itineraries: Array.from(itinerariesMap.values()),
        comments: commentRows || [],
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Fetch trip error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error: String(err), success: false },
      { status: 500 },
    );
  }
}
