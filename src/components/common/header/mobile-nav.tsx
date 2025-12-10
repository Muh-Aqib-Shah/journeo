'use client';

import { IconMenu2, IconWorld } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Nav } from '@/lib/types/nav';

import MobileLink from './mobile-link';
import UserMobileNav from './user-mobile-nav';

const MobileNav: React.FC<Nav> = ({ isLoggedIn, user }) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block cursor-pointer sm:hidden">
        <IconMenu2 className="text-primary" />
      </SheetTrigger>
      <SheetContent side="left" className="container">
        <div className="mt-10 flex flex-col space-y-4">
          <MobileLink href="/explore">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start gap-2"
            >
              <IconWorld className="size-6 text-gray-500" />
              <span>Explore</span>
            </Button>
          </MobileLink>
          {isLoggedIn ? (
            <UserMobileNav isLoggedIn={isLoggedIn} user={user} />
          ) : (
            <>
              <Separator />
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Get started
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full" variant="secondary" size="lg">
                  Sign in
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
