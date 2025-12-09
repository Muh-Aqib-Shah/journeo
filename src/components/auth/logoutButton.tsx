'use client';

import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/auth';

interface LogoutButtonProps {
  variant: 'MOBILE' | 'SCREEN';
}
export const LogoutButton: React.FC<LogoutButtonProps> = ({ variant }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchWithAuth('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
      return [];
    } catch (err) {
      return [];
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`${variant === 'MOBILE' ? '' : 'px-0'}  flex w-auto items-start justify-start`}
    >
      <>
        <IconLogout className="mr-2 size-5 stroke-1 text-gray-500" />
        <span className={`${variant === 'MOBILE' ? 'hidden' : 'block'}`}>
          Logout
        </span>
      </>
    </Button>
  );
};
