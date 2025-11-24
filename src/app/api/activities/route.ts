import { NextResponse } from 'next/server';

import { amadeus } from '@/lib/connection/amadeus';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat & lng required' }, { status: 400 });
  }

  try {
    const response = await amadeus.shopping.activities.get({
      latitude: lat,
      longitude: lng,
      radius: 20,
    });

    return NextResponse.json(response.result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
