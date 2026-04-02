import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  const url = req.nextUrl;

  // Check if token is valid
  let isValidToken = false;

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

      await jwtVerify(accessToken, secret);
      isValidToken = true;
    } catch (err) {
      console.error('JWT ERROR:', err);
      isValidToken = false;
    }
  }

  if (url.pathname === '/login') {
    if (isValidToken) {
      url.pathname = '/explore';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const protectedRoutes = ['/trips', '/create-trip'];
  if (protectedRoutes.includes(url.pathname)) {
    console.log('PROTECTEDDDDDDD ROUTEEEEEE');
    if (!isValidToken) {
      console.log('GOING FROM ', url.pathname, 'To /login');
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/trips', '/create-trip'],
  runtime: 'nodejs',
};
