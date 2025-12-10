'use client';

import { IconPlaneTilt, IconSettingsFilled } from '@tabler/icons-react';
import React from 'react';

import { LogoutButton } from '@/components/auth/logoutButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Nav } from '@/lib/types/nav';

const UserNav: React.FC<Nav> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-8">
          <AvatarImage src={undefined} />
          <AvatarFallback>{user?.username?.at(0) ?? ''}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 md:w-56">
        <div className="mb-2 space-y-1">
          <DropdownMenuLabel className="text-ellipsis text-nowrap py-0 font-medium">
            {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-ellipsis text-nowrap py-0 font-normal text-gray-500">
            {user?.email}
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconPlaneTilt className="mr-2 size-5 fill-gray-500 stroke-1 text-gray-500" />
          <span>My Trips</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconSettingsFilled className="mr-2 size-5 stroke-1 text-gray-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton variant="SCREEN" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
