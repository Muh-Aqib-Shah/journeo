'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import type { Control, UseFormTrigger } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
}

const FlightDetails: React.FC<Props> = ({ stepfn, control, trigger }) => {
  const onSubmit = async () => {
    const res = await trigger([
      'flightFrom',
      'flightTo',
      'flightDate',
      'ticektNo',
      'flightNo',
    ]);
    if (res) {
      stepfn(3);
    }
  };

  return (
    <>
      <div className="text-center text-2xl sm:text-4xl">
        Provide Flight Info
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <FormField
            control={control}
            name="flightFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From City</FormLabel>
                <FormControl>
                  <Input placeholder="City *" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-1/2">
          <FormField
            control={control}
            name="flightTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To City</FormLabel>
                <FormControl>
                  <Input placeholder="City *" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={control}
        name="flightDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Departure Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto size-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="flightNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Flight Number</FormLabel>
            <FormControl>
              <Input placeholder="Flight No *" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="ticektNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Number or Reservation Code</FormLabel>
            <FormControl>
              <Input placeholder="Ticket No *" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-between gap-4 pt-6">
        <Button
          type="button"
          variant="secondary"
          className="w-[30%]"
          onClick={() => stepfn(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l14 0" />
            <path d="M5 12l6 6" />
            <path d="M5 12l6 -6" />
          </svg>
        </Button>
        <Button type="button" onClick={onSubmit} className="w-[70%]">
          Next
        </Button>
      </div>
    </>
  );
};

export default FlightDetails;
