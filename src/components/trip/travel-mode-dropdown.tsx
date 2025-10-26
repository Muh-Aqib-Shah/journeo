'use client';

import {
  IconBike,
  IconBus,
  IconCar,
  IconChevronDown,
  IconWalk,
} from '@tabler/icons-react';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import VerticalDivider from './vertical-divider';

type TravelMode = 'car' | 'bus' | 'bike' | 'walk';

type TravelModeOption = {
  mode: TravelMode;
  time: number;
  linkToRoute: string;
};

interface Props {
  options: TravelModeOption[];
}

const getIcon = (option: TravelMode) => {
  const style = 'w-5 h-5';
  switch (option) {
    case 'bike':
      return <IconBike className={style} />;
    case 'car':
      return <IconCar className={style} />;
    case 'bus':
      return <IconBus className={style} />;
    case 'walk':
      return <IconWalk className={style} />;
    default:
      return null;
  }
};

const TravelModeDropDown: FC<Props> = ({ options }) => {
  const [selectedTravelMode, setSelectedTravelMode] =
    useState<TravelMode>('car');

  const selectedTravelItem = options.find(
    (v) => v.mode === selectedTravelMode,
  )!;

  return (
    <>
      <VerticalDivider />
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="my-1 ml-10 flex cursor-pointer items-center gap-0.5">
              {getIcon(selectedTravelItem.mode)}
              <IconChevronDown className="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            {options.map((v) => (
              <DropdownMenuCheckboxItem
                className="cursor-pointer py-1 text-gray-700"
                checked={v.mode === selectedTravelMode}
                onCheckedChange={() => setSelectedTravelMode(v.mode)}
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedTravelMode(v.mode);
                }}
                key={v.mode}
              >
                <span>{getIcon(v.mode)}</span>
                <span className="ml-4">{v.time} min</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          href={selectedTravelItem.linkToRoute}
          target="_blank"
          className="cursor-pointer text-sm text-gray-600 hover:underline hover:underline-offset-4"
        >
          {selectedTravelItem.time} min
          <span> ›</span>
        </Link>
      </div>
      <VerticalDivider />
    </>
  );
};

export default TravelModeDropDown;
