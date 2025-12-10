'use client';

import { IconPlaneTilt, IconSettingsFilled } from '@tabler/icons-react';
import React from 'react';

import { LogoutButton } from '@/components/auth/logoutButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Nav } from '@/lib/types/nav';

import MobileLink from './mobile-link';

const UserMobileNav: React.FC<Nav> = ({ user }) => {
  return (
    <>
      <MobileLink href="/trips">
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start gap-2"
        >
          <IconPlaneTilt className="size-6 fill-gray-500 text-gray-500" />
          <span>My Trips</span>
        </Button>
      </MobileLink>

      <MobileLink href="/#">
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start gap-2"
        >
          <IconSettingsFilled className="size-6 text-gray-500" />
          <span>Settings</span>
        </Button>
      </MobileLink>

      <Separator />

      <Button
        variant="secondary"
        className="flex h-auto w-full items-center justify-between px-8 py-4"
      >
        <div className="text-left">
          <h3 className="font-medium">{user?.username}</h3>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <LogoutButton variant="MOBILE" />
      </Button>
    </>
  );
};

export default UserMobileNav;
