import { format, fromUnixTime } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

import VerticalDivider from './vertical-divider';

interface Props {
  day: number;
}

const DayInfo: FC<Props> = ({ day }) => {
  return (
    <>
      <div className="inline-flex h-9 items-center rounded-xl bg-gray-100 px-6">
        <span className="font-bold capitalize">
          {format(fromUnixTime(day), 'EEE, d MMM')}
        </span>
      </div>
      <VerticalDivider />
    </>
  );
};

export default DayInfo;
