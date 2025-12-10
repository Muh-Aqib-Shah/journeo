'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types/user';

import MobileNav from './mobile-nav';
import UserNav from './user-nav';

type ErrProps = {
  success: boolean;
  error: string;
};

const isUser = (user: User | ErrProps): user is User => {
  return !!user && 'user_id' in user;
};

const Header = ({ user }: { user: User | ErrProps }) => {
  const router = useRouter();
  const isLoggedIn = isUser(user);

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
          <UserNav user={user} isLoggedIn={isLoggedIn} />
        ) : (
          <>
            <Button size="sm" onClick={() => router.push('/login')}>
              Get started
            </Button>
            <Button
              onClick={() => router.push('/login')}
              size="sm"
              variant="outline"
              className="items-center gap-x-1"
            >
              Sign in
            </Button>
          </>
        )}
      </div>
      {isLoggedIn && <MobileNav isLoggedIn={isLoggedIn} user={user} />}
    </header>
  );
};

export default Header;
