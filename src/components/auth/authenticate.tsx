/* eslint-disable */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fetchWithAuth, verifyAccessToken } from '@/lib/auth';
import { SignupSchema } from '@/lib/schema/auth';
import type { SignupType } from '@/lib/types/auth';

interface LoginProps {
  access_token: string | undefined;
}
export const LoginForm: React.FC<LoginProps> = ({ access_token }) => {
  const router = useRouter();

  const [isLogin, setisLogin] = useState<boolean>(true);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const form = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (values: SignupType) => {
    setDisableBtn(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth//register';
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if(response.ok){ router.push('/explore'); 
      router.refresh();
    }

    const data = await response.json();
    if (response.ok) {
      toast.success(data.message);
    } else toast.error(data.message);
    setDisableBtn(false);
  };

  return (
    <div className="mt-28 flex items-center justify-center">
      <div className="w-[300px] sm:w-[500px]">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-5">
              <div className="text-center text-2xl sm:text-4xl">
                {isLogin ? 'Login' : 'Register'}
              </div>

              {!isLogin && (
                <FormField
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="jhondoe"
                            className="px-9 "
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="jhondoe@gmail.com"
                          className="px-9 "
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Password"
                          className="px-9"
                          type="password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-6">
                <Button type="submit" className="w-full" disabled={disableBtn}>
                  Submit
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <span>
                    <span>Don&apos;t have an account? </span>
                    <span
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={() => setisLogin(false)}
                    >
                      Register here
                    </span>
                  </span>
                ) : (
                  <span>
                    <span>Already have a account? </span>
                    <span
                      className="text-primary underline-offset-4 hover:underline"
                      onClick={() => setisLogin(true)}
                    >
                      Login here
                    </span>
                  </span>
                )}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
