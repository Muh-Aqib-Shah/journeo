/* eslint-disable react/no-array-index-key */

'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { eachDayOfInterval, format, isBefore } from 'date-fns';
import { Plus } from 'lucide-react';
import type {
  type Control,
  type FieldValues,
  type UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ActivitiesList } from './list-activities';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  watch: UseFormWatch<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
}

const DateRangePlanner = ({ from, to }: { from: Date; to: Date }) => {
  if (!from || !to) return null;

  // Generate array of all dates between range
  const days = eachDayOfInterval({
    start: from,
    end: to,
  });
  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {days.map((date, index) => (
          <AccordionItem
            key={index}
            value={`day-${index}`}
            className="border-b py-2"
          >
            <AccordionTrigger className="flex w-full justify-between text-lg font-semibold">
              <div className="flex items-center gap-2">
                {format(date, 'EEEE, MMM d')}
                <span className="ml-2 text-base text-green-700 underline">
                  Add a location
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="rounded-xl border bg-muted/30 p-4">
                <Sheet>
                  <SheetTrigger>
                    <span className="flex items-center gap-2 rounded-md border border-b-2 p-3">
                      <Plus className="size-4" />
                      Add
                    </span>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="!w-[500px] !max-w-[600px] overflow-y-auto p-4"
                  >
                    <SheetHeader>
                      <SheetTitle>Activities</SheetTitle>
                      <ActivitiesList lat={41.397158} lng={2.160873} />
                      <SheetDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

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

const FlightDetails: React.FC<Props> = ({
  stepfn,
  control,
  watch,
  trigger,
}) => {
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

  const duration = watch('duration');

  return (
    <>
      <div className="text-center text-2xl sm:text-4xl">Iteinary Planner</div>

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

      {duration?.from && duration?.to && (
        <DateRangePlanner from={duration.from} to={duration.to} />
      )}

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
