import { NextResponse } from 'next/server';

import { amadeus } from '@/lib/connection/amadeus';

// Simple in-memory cache
const cache: Record<string, { timestamp: number; data: any }> = {};
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat & lng required' }, { status: 400 });
  }

  const cacheKey = `${lat}_${lng}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return NextResponse.json(cache[cacheKey].data);
  }

  try {
    const response = await amadeus.shopping.activities.get({
      latitude: lat,
      longitude: lng,
      radius: 20,
    });

    cache[cacheKey] = {
      timestamp: now,
      data: response.result,
    };

    return NextResponse.json(response.result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
