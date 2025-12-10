import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  const url = req.nextUrl;

  // Check if token is valid
  let isValidToken = false;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || '');
      isValidToken = true;
    } catch {
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
    /* if (!isValidToken) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    } */
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/trips', '/create-trip'],
  runtime: 'nodejs',
};
