import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

import { getUser } from '../get-user';
import MobileNav from './mobile-nav';
import UserNav from './user-nav';

const Header = async () => {
  const user = await getUser();
  const isLoggedIn = user.success;

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

        {isLoggedIn ? (
          <UserNav />
        ) : (
          <>
            <Link href="/login">
              <Button size="sm">Get started</Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="items-center gap-x-1"
              >
                Sign in
              </Button>
            </Link>
          </>
        )}
      </div>
      <MobileNav />
    </header>
  );
};

export default Header;
