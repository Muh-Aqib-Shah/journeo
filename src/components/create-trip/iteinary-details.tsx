/* eslint-disable react/no-array-index-key */

'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, isBefore, startOfDay } from 'date-fns';
import { Loader } from 'lucide-react';
import type { Control, FieldValues, UseFormWatch } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Coordinates, CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DateRangePlanner } from './iteinary/date-range-planner';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  watch: UseFormWatch<CreateTripType>;
  btnState: boolean;
  coords: Coordinates | null;
}

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

const IteinaryDetails: React.FC<Props> = ({
  stepfn,
  control,
  watch,
  btnState,
  coords,
}) => {
  const { setValue } = useFormContext();

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
                      <div className="p-3">
                        {field.value?.from && field.value?.to && (
                          <div className="mb-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                field.onChange({
                                  from: undefined,
                                  to: undefined,
                                })
                              }
                            >
                              Clear Dates
                            </Button>
                          </div>
                        )}
                        <Calendar
                          initialFocus
                          mode="range"
                          disabled={(date) =>
                            isBefore(date, startOfDay(new Date()))
                          }
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={(selectedDate) => {
                            field.onChange(selectedDate);
                          }}
                          numberOfMonths={2}
                        />
                      </div>
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
        <DateRangePlanner
          from={duration.from}
          to={duration.to}
          coords={coords}
          watch={watch}
          setValue={setValue}
        />
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

        <Button type="submit" disabled={btnState} className="w-[70%]">
          {btnState ? <Loader className="animate-spin" /> : 'Submit'}
        </Button>
      </div>
    </>
  );
};

export default IteinaryDetails;
