import { NextResponse } from 'next/server';

import { amadeus } from '@/lib/connection/amadeus';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('query');

  if (!keyword) {
    return NextResponse.json([]);
  }

  try {
    const res = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'CITY,AIRPORT',
    });

    const locations = res.data.map((item: any) => ({
      name: item.name,
      city: item.address?.cityName,
      country: item.address?.countryName,
      geoCode: item.geoCode,
    }));

    return NextResponse.json(locations);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
