import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  const url = req.nextUrl;

  if (url.pathname === '/login') {
    if (accessToken) {
      url.pathname = '/explore';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const protectedRoutes = ['/trips', '/create-trip'];
  if (protectedRoutes.includes(url.pathname)) {
    /* if (!accessToken) {
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
