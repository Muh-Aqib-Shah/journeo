'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface User {
  email: string;
  name?: string;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(true);
        // Try to get user info from the response or from a separate endpoint
        // For now, we'll need to decode the JWT or fetch user info
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          setUser({ email: userEmail });
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    checkAuth();
  }, [pathname]); // Re-check auth whenever route changes

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="container flex h-14 items-center sm:h-16">
      <div className="grow">
        <Link href="/" className="text-2xl font-bold text-primary">
          Journeo.
        </Link>
      </div>
      <div className="hidden items-center gap-x-4 sm:flex">
        <Link href="/explore">
          <Button variant="link">Explore</Button>
        </Link>

        {!loading && (
          <>
            {isLoggedIn ? (
              <>
                <Link href="/trips">
                  <Button variant="link">My Trips</Button>
                </Link>
                {user && (
                  <span className="text-sm text-gray-600">{user.email}</span>
                )}
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm">Get started</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
