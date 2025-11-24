'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { Control, UseFormTrigger } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Toggle } from '../ui/toggle';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
}

const DestinationDetails: React.FC<Props> = ({ stepfn, control, trigger }) => {
  const onSubmit = async () => {
    const res = await trigger([
      'destination',
      'duration',
      'times.start',
      'times.end',
      'visibility',
    ]);
    if (res) {
      stepfn(2);
    }
  };
  return (
    <>
      <div className="text-center text-2xl sm:text-4xl">Create Vacation</div>

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trip name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="e.g Vacation in Greece"
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
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-0 top-[30%] mx-3" />
                <Input placeholder="Where to?" className="px-9 " {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <div className="w-full space-y-2 pt-4">
              <FormLabel className="block text-sm font-semibold">
                Share Vacation with Others?
              </FormLabel>
              <FormControl>
                <Toggle
                  size="sm"
                  aria-label="visibility toggle"
                  className={cn(!field.value && 'text-red-400')}
                  onPressedChange={(value) => field.onChange(value)}
                  pressed={field.value}
                >
                  {field.value ? 'Yes' : ' No'}
                </Toggle>
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <div className="flex justify-end pt-6">
        <Button type="button" className="w-full" onClick={onSubmit}>
          Next
        </Button>
      </div>
    </>
  );
};

export default DestinationDetails;
