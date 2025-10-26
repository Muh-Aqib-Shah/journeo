import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  IconLogout,
  IconPlaneTilt,
  IconSettingsFilled,
} from '@tabler/icons-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserNav = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-8">
          <AvatarImage src={user?.picture ?? undefined} />
          <AvatarFallback>
            {user?.given_name?.at(0)}
            {user?.family_name?.at(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 md:w-56">
        <div className="mb-2 space-y-1">
          <DropdownMenuLabel className="text-ellipsis text-nowrap py-0 font-medium">
            {user?.given_name} {user?.family_name}
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
          <LogoutLink className="flex w-full">
            <IconLogout className="mr-2 size-5 stroke-1 text-gray-500" />
            <span>Logout</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
