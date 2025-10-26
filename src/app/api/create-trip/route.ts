import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { CreateTripType } from '@/lib/types/create-trip';

export async function POST(req: NextRequest) {
  const body: CreateTripType = await req.json();

  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id)
    return NextResponse.json(
      { message: 'user not logged in!' },
      { status: 401 },
    );
  try {
    console.log('inserted data:', body); // replace with actual data logging
    return NextResponse.json(
      { message: 'Data submitted successfully' },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
