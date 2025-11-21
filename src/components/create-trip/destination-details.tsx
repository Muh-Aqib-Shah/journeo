'use client';

import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { format, isBefore } from 'date-fns';
import type { Control, FieldValues, UseFormTrigger } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Toggle } from '../ui/toggle';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
}

const DestinationDetails: React.FC<Props> = ({ stepfn, control, trigger }) => {
  const renderDate = (field: FieldValues) => {
    if (field.value?.from) {
      if (field.value?.to) {
        return (
          <>
            {format(field.value.from, 'LLL dd, y')} -{' '}
            {format(field.value.to, 'LLL dd, y')}
          </>
        );
      }
      return format(field.value.from, 'LLL dd, y');
    }
    return <span>Pick a date</span>;
  };

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

      <div className="block gap-3 space-y-4 pt-6 sm:flex sm:space-y-0">
        <div className="w-full">
          <FormField
            control={control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choose a date plan!</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          'w-full justify-center text-left font-normal',
                          !field.value.to && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {renderDate(field)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        disabled={(date) => isBefore(date, new Date())}
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={(selectedDate) => {
                          field.onChange(selectedDate);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

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
