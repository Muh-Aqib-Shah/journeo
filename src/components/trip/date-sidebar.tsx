'use client';

import { eachDayOfInterval, format, fromUnixTime } from 'date-fns';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

interface Props {
  startDate: number;
  endDate: number;
}

const DateSidebar: FC<Props> = ({ endDate, startDate }) => {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const scrollToSection = useCallback((date: string) => {
    const section = document.querySelector<HTMLElement>(
      `[data-date="${date}"]`,
    );
    if (section) {
      window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      const mainContentSections =
        document.querySelectorAll<HTMLElement>('[data-date]');
      let activeItem: string | null = null;

      mainContentSections.forEach((section) => {
        const { offsetTop, offsetHeight } = section;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          activeItem = section.getAttribute('data-date');
        }
      });

      setActiveDate(activeItem);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActiveDateChanged = useCallback(
    (date: string) => {
      setActiveDate(date);
      scrollToSection(date);
    },
    [scrollToSection],
  );

  const formattedDates = eachDayOfInterval({
    start: fromUnixTime(startDate),
    end: fromUnixTime(endDate),
  }).map((date) => ({
    day: format(date, 'd'),
    month: format(date, 'MMM'),
  }));

  const monthNames = Array.from(
    new Set(formattedDates.map(({ month }) => month)),
  );

  return (
    <div className="flex items-center sm:block">
      {monthNames.map((month) => (
        <div key={month} className="flex items-center sm:block sm:text-center">
          <div className="px-2 font-semibold capitalize text-gray-700 sm:px-0 sm:py-2">
            {month}
          </div>
          <div className="flex sm:block">
            {formattedDates
              .filter((date) => date.month === month)
              .map(({ day }) => (
                <Button
                  key={day}
                  variant="ghost"
                  className={cn(
                    'cursor-pointer text-gray-500',
                    activeDate === `${day}-${month}` &&
                      'underline underline-offset-4 text-gray-700 font-medium',
                  )}
                  onClick={() => handleActiveDateChanged(`${day}-${month}`)}
                >
                  {day}
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateSidebar;
