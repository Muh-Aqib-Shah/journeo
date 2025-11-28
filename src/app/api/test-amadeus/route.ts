import { NextResponse } from 'next/server';

async function getAmadeusToken() {
  const response = await fetch(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
    },
  );

  const data = await response.json();
  return data.access_token;
}

export async function GET() {
  try {
    // Get access token
    const token = await getAmadeusToken();

    // Fetch activities in Paris (example)
    const response = await fetch(
      'https://test.api.amadeus.com/v1/shopping/activities?latitude=48.8566&longitude=2.3522&radius=20',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      count: data.data?.length || 0,
      activities: data.data?.slice(0, 5), // Return first 5 activities
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
