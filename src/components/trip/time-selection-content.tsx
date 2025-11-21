import { IconArrowRight } from '@tabler/icons-react';
import { format, fromUnixTime } from 'date-fns';
import type { Dispatch, FC, SetStateAction } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import type { CreateTripType } from '@/lib/types/create-trip';
import { generateTimeOptions } from '@/lib/utils';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
  time: {
    start: number;
    end: number;
  };
  setTime: Dispatch<SetStateAction<{ start: number; end: number }>>;
  baseDate: number;
  setValue?: UseFormSetValue<CreateTripType>;
}

const TimeSelectionContent: FC<Props> = ({
  time,
  setTime,
  baseDate,
  setValue,
}) => {
  const [activeInput, setActiveInput] = useState<'start' | 'end'>('start');

  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const timeOptions = generateTimeOptions(baseDate);

  const handleOptionClick = (option: number) => {
    if (activeInput === 'start') {
      setTime((prev) => ({
        ...prev,
        start: option,
      }));
      endTimeRef.current?.focus();
    } else if (activeInput === 'end') {
      setTime((prev) => ({
        ...prev,
        end: option,
      }));
      startTimeRef.current?.focus();
    }
  };

  useEffect(() => {
    const registerInput = () => {
      try {
        if (setValue) setValue('times', time);
      } catch (e) {
        // console.error(e);
      }
    };
    registerInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <>
      <section className="flex w-full items-center gap-2">
        <div className="flex w-full flex-col items-center">
          <span className="text-sm text-gray-600">Start time</span>
          <div className="flex w-full items-center gap-2">
            <Input
              className="h-auto px-0.5 py-1 pl-2 outline-none  focus:border-gray-700"
              ref={startTimeRef}
              value={format(fromUnixTime(time.start), 'h:mm a')}
              onFocus={() => setActiveInput('start')}
              readOnly
            />
            <IconArrowRight className="size-3 text-gray-700" />
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <span className="text-sm text-gray-600">End time</span>
          <Input
            className="h-auto px-0.5 pl-2 outline-none focus:border-gray-700"
            ref={endTimeRef}
            value={format(fromUnixTime(time.end), 'h:mm a')}
            readOnly
            onFocus={() => setActiveInput('end')}
          />
        </div>
      </section>

      <ScrollArea className="h-48 rounded-lg border text-center md:h-32">
        {timeOptions.map((option) => (
          <Button
            key={option.display}
            variant="ghost"
            className="w-full font-normal text-gray-700"
            onClick={() => handleOptionClick(option.unix)}
          >
            {option.display}
          </Button>
        ))}
      </ScrollArea>
    </>
  );
};

export default TimeSelectionContent;
