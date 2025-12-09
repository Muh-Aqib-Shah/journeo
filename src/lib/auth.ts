import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

function verifyAccessToken(token: string | undefined) {
  if (!token) return false;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const isServer = typeof window === 'undefined';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let completeUrl = baseUrl;
  if (isServer && url.startsWith('/')) completeUrl = baseUrl + url;

  let res = await fetch(url, options);

  if (res.status === 400) {
    const refreshRes = await fetch(`${completeUrl}/api/auth/refresh`, {
      method: 'POST',
    });
    if (refreshRes.ok) {
      res = await fetch(url, options);
    } else {
      if (isServer) {
        return NextResponse.redirect(new URL('/login', url));
      }
      window.location.href = '/login';
      return new Response(null, { status: 401 });
    }
  }
  return res;
}

export { fetchWithAuth, verifyAccessToken };
