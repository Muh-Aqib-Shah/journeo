'use client';

import { isBefore } from 'date-fns';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import TimeSelectionContent from './time-selection-content';
import TimeSelectionTrigger from './time-selection-trigger';

interface Props {
  startTime: number;
  endTime: number;
  setValue?: UseFormSetValue<CreateTripType>;
  size?: 'auto' | 'medium' | 'full';
}

const TimeSelectionDropDown: FC<Props> = ({
  startTime,
  endTime,
  setValue,
  size = 'auto',
}) => {
  const [time, setTime] = useState({ start: startTime, end: endTime });

  const isEndtimeBefore = isBefore(time.end, time.start);

  return (
    <>
      <Popover>
        <PopoverTrigger
          className={cn(
            'mt-1 hidden sm:block',
            size === 'auto' && 'size-auto text-xs',
            size === 'medium' && 'h-[30px] w-1/2 text-sm',
            size === 'full' && 'h-[40px] w-full mt-0',
          )}
        >
          <TimeSelectionTrigger startTime={time.start} endTime={time.end} />
        </PopoverTrigger>

        <PopoverContent className="max-w-xs space-y-2.5" align="start">
          <TimeSelectionContent
            time={time}
            setTime={setTime}
            baseDate={startTime}
            setValue={setValue}
          />
          {isEndtimeBefore ? (
            <div className="text-xs font-medium text-red-500">
              End time cannot be before the start time.
            </div>
          ) : null}
          <Button className="w-full" size="sm" disabled={isEndtimeBefore}>
            Save
          </Button>
        </PopoverContent>
      </Popover>
      <Drawer>
        <DrawerTrigger
          className={cn(
            'mt-1.5 block sm:hidden',
            size === 'auto' && 'size-auto text-xs',
            size === 'medium' && 'h-[30px] w-1/2 p-2 text-xs',
            size === 'full' && 'h-[40px] w-full text-xs mt-0',
          )}
        >
          <TimeSelectionTrigger startTime={time.start} endTime={time.end} />
        </DrawerTrigger>
        <DrawerContent
          className="container space-y-3"
          aria-describedby="time-selection"
        >
          <TimeSelectionContent
            time={time}
            setTime={setTime}
            baseDate={startTime}
            setValue={setValue}
          />
          {isEndtimeBefore ? (
            <div className="text-xs font-medium text-red-500">
              End time cannot be before the start time.
            </div>
          ) : null}
          <Button className="w-full" size="sm" disabled={isEndtimeBefore}>
            Save
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TimeSelectionDropDown;
