import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { trips } from '@/drizzle/schema';
import type { CreateTripType } from '@/lib/types/create-trip';

export async function POST(req: NextRequest) {
  const body: CreateTripType = await req.json();

  const dateToUnixTime = (date: string | Date) =>
    Math.floor(new Date(date).getTime() / 1000);

  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id)
    return NextResponse.json(
      { message: 'user not logged in!' },
      { status: 401 },
    );
  try {
    await db.insert(trips).values({
      ...body,
      durationStart: dateToUnixTime(body?.duration?.from),
      durationEnd: dateToUnixTime(body?.duration?.to),
      tripStartTime: body?.times?.start,
      tripEndTime: body?.times?.end,
      checkInStart: dateToUnixTime(body?.checkIn?.start),
      checkInEnd: dateToUnixTime(body?.checkIn?.end),
      flightDate: dateToUnixTime(body?.flightDate),
      userId: kindeUser?.id,
      ticketNo: body.ticektNo,
    });
    return NextResponse.json(
      { message: 'Data submitted successfully' },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
