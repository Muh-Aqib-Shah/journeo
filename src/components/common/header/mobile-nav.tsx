import {
  LoginLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { IconMenu2, IconWorld } from '@tabler/icons-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import MobileLink from './mobile-link';
import UserMobileNav from './user-mobile-nav';

const MobileNav = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

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
            <UserMobileNav />
          ) : (
            <>
              <Separator />
              <RegisterLink>
                <Button className="w-full" size="lg">
                  Get started
                </Button>
              </RegisterLink>
              <LoginLink>
                <Button className="w-full" variant="secondary" size="lg">
                  Sign in
                </Button>
              </LoginLink>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
