import { format, fromUnixTime } from 'date-fns';
import Image from 'next/image';
import React, { Fragment } from 'react';

import DateSidebar from '@/components/trip/date-sidebar';
import DayInfo from '@/components/trip/day-info';
import LocationCard from '@/components/trip/location-card';
import TravelModeDropDown from '@/components/trip/travel-mode-dropdown';
import VerticalDivider from '@/components/trip/vertical-divider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { travelModeOption, trip } from '@/lib/data/trip';

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="space-y-10 sm:container">
        <section className="relative h-64  rounded-lg px-6 sm:px-0">
          <Image
            src="/placeholder_location.png"
            alt="khi"
            height={1000}
            width={1000}
            className="size-full rounded-lg object-cover object-center"
          />
          <span className="absolute bottom-5 left-8 text-3xl font-semibold text-white">
            {trip.location.city}, {trip.location.country}
          </span>
        </section>
        <div>
          <ScrollArea className="!sticky top-0 z-50 mb-4 mt-2 h-12 overflow-x-auto border-b border-gray-100 bg-gray-50 shadow-sm sm:hidden">
            <DateSidebar endDate={trip.to} startDate={trip.from} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <section className="flex flex-col gap-x-5 px-6 sm:flex-row sm:px-0">
            <ScrollArea className="!sticky top-0 hidden h-screen w-14 sm:block">
              <DateSidebar endDate={trip.to} startDate={trip.from} />
            </ScrollArea>
            <section className="w-full">
              {trip.itinerary.map((t, dayIdx) => (
                <div
                  key={t.date}
                  data-date={format(fromUnixTime(t.date), 'd-MMM')}
                >
                  <DayInfo day={t.date} />
                  {t.activities.map((activity, activityIdx) => (
                    <Fragment key={activity.location}>
                      <LocationCard
                        location={activity.location}
                        desc={activity.description}
                        time={activity.time}
                        image="/placeholder_location.png"
                      />
                      {!(
                        dayIdx === trip.itinerary.length - 1 &&
                        activityIdx === t.activities.length - 1
                      ) &&
                        (activityIdx < t.activities.length - 1 ? (
                          <TravelModeDropDown options={travelModeOption} />
                        ) : (
                          <VerticalDivider />
                        ))}
                    </Fragment>
                  ))}
                </div>
              ))}
            </section>
          </section>
        </div>
      </div>

      <div className="hidden lg:block" />
    </div>
  );
};

export default Page;
