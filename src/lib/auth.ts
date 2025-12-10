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
  let completeUrl = url;
  if (isServer && url.startsWith('/')) completeUrl = baseUrl + url;

  let res = await fetch(completeUrl, options);

  // Only auto-refresh on 401 (Unauthorized), not 400 (Bad Request)
  if (res.status === 401) {
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      res = await fetch(completeUrl, options);
    } else {
      if (isServer) {
        return NextResponse.redirect(`${baseUrl}/login`);
      }
      window.location.href = '/login';
      return new Response(null, { status: 401 });
    }
  }
  return res;
}

export { fetchWithAuth, verifyAccessToken };
