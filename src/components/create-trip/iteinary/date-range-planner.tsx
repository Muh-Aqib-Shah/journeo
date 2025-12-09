/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { IconTrash } from '@tabler/icons-react';
import { eachDayOfInterval, format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type {
  ActivityType,
  Coordinates,
  CreateTripType,
  IteinaryType,
} from '@/lib/types/create-trip';

import { ActivitiesList } from './activities-list';
import { ActivityCard } from './activity-card';

type DateRangePlannerProps = {
  from: Date;
  to: Date;
  coords: Coordinates | null;
  watch: UseFormWatch<CreateTripType>;
  setValue: any;
};

export const DateRangePlanner: React.FC<DateRangePlannerProps> = ({
  from,
  to,
  watch,
  setValue,
  coords,
}) => {
  const iteinary: IteinaryType = watch('iteinary');

  const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');

  const updateIteinary = useCallback(
    (newState: IteinaryType) => {
      if (!from || !to) return;
      setValue('iteinary', newState, { shouldValidate: true });
    },
    [setValue, from, to],
  );

  const addActivity = (date: Date, activity: ActivityType): void => {
    if (!from || !to) return;

    const key = dateToString(date);

    const day = iteinary?.find((d) => dateToString(d.date) === key);

    if (day?.activities.some((a) => a.name === activity.name)) {
      toast.warning('Activity already exists!');
    }

    const newState = iteinary.map((d) =>
      dateToString(d.date) === key
        ? {
            ...d,
            activities: [
              ...d.activities,
              {
                ...activity,
                price: {
                  ...activity.price,
                  amount: Number(activity.price?.amount ?? 100),
                },
                minimumDuration: activity.minimumDuration
                  ? activity.minimumDuration
                  : '1 hour',
              },
            ],
          }
        : d,
    );

    updateIteinary(newState);
  };

  const removeActivity = (date: Date, activity: ActivityType) => {
    if (!from || !to) return;

    const key = dateToString(date);

    const newState = iteinary.map((d) =>
      dateToString(d.date) === key
        ? {
            ...d,
            activities: d.activities.filter((a) => a.name !== activity.name),
          }
        : d,
    );

    updateIteinary(newState);
  };

  const getActivitiesFromDate = useCallback(
    (date: Date) => {
      const key = dateToString(date);
      const dayPlanned = iteinary.find((d) => dateToString(d.date) === key);
      return dayPlanned?.activities ?? [];
    },
    [iteinary],
  );

  useEffect(() => {
    if (!from || !to) return;
    const dates = eachDayOfInterval({ start: from, end: to });

    const newState = dates.map((date, idx) => ({
      day: idx + 1,
      date,
      activities: getActivitiesFromDate(date),
    }));

    updateIteinary(newState);
  }, [from, to]);

  const dates = eachDayOfInterval({
    start: from,
    end: to,
  });

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {dates.map((date, index) => (
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
                {Array.isArray(getActivitiesFromDate(date)) &&
                  getActivitiesFromDate(date)!.map((hero: ActivityType) => {
                    return (
                      <div
                        className="group relative m-4 cursor-pointer"
                        key={hero.name}
                      >
                        <ActivityCard act={hero} />
                        <div
                          className="absolute right-4 top-2 text-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              removeActivity(date, hero);
                          }}
                          onClick={() => removeActivity(date, hero)}
                        >
                          <IconTrash
                            stroke={0.7}
                            width={20}
                            className="rounded-sm hover:bg-gray-100"
                          />
                        </div>
                      </div>
                    );
                  })}
                <Sheet>
                  <SheetTrigger>
                    <span className="flex items-center gap-2 rounded-md border border-b-2 p-3">
                      <Plus className="size-4" />
                      Add
                    </span>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[350px] !max-w-[600px] overflow-y-auto p-4 lg:!w-[500px]"
                  >
                    <SheetHeader>
                      <SheetTitle>Activities</SheetTitle>
                      <ActivitiesList
                        coords={coords}
                        time={date}
                        selectAct={addActivity}
                      />
                      <SheetDescription>
                        All Activities under an area of 20km appear here with
                        price in EUR mentioned aswell as duration
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
