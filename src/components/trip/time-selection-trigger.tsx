import { IconArrowRight } from '@tabler/icons-react';
import { format, fromUnixTime } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

interface Props {
  startTime: number;
  endTime: number;
}

const TimeSelectionTrigger: FC<Props> = ({ startTime, endTime }) => {
  return (
    <div className="flex size-full items-center justify-center gap-1 rounded-lg border border-solid border-gray-300 bg-white p-1 text-gray-700">
      {format(fromUnixTime(startTime), 'h:mm a')}
      <IconArrowRight className="size-3" />
      {format(fromUnixTime(endTime), 'h:mm a')}
    </div>
  );
};

export default TimeSelectionTrigger;
