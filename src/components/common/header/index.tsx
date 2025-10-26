import {
  LoginLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

import MobileNav from './mobile-nav';
import UserNav from './user-nav';

const Header = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

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
            <RegisterLink>
              <Button size="sm">Get started</Button>
            </RegisterLink>
            <LoginLink>
              <Button
                size="sm"
                variant="outline"
                className="items-center gap-x-1"
              >
                Sign in
              </Button>
            </LoginLink>
          </>
        )}
      </div>
      <MobileNav />
    </header>
  );
};

export default Header;
