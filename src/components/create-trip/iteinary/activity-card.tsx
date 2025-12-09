/* eslint-disable react/no-danger */

import DOMPurify from 'dompurify';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ActivityType } from '@/lib/types/create-trip';

interface Activity {
  act: ActivityType;
}

interface ActivityState {
  selected?: ActivityType | null;
  setSelected?: React.Dispatch<React.SetStateAction<ActivityType | null>>;
}

// Combined props interface for ActivityCard
interface ActivityCardProps extends Activity, ActivityState {}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  act,
  selected,
  setSelected,
}) => {
  return (
    <Card
      key={act.pictures[0]}
      className={`flex cursor-pointer overflow-hidden rounded-xl border shadow-sm ${
        selected?.name === act.name ? 'border-2 border-black' : ''
      }`}
      onClick={() =>
        setSelected
          ? setSelected((prev) => {
              if (!prev) return act;
              return prev.name === act.name ? null : act;
            })
          : null
      }
    >
      {act.pictures?.length > 0 && (
        <div className="w-1/3">
          <Image
            src={act.pictures[0]}
            alt={act.name}
            width={1000}
            height={1000}
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex w-2/3 flex-col justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-lg">{act.name}</CardTitle>
        </CardHeader>
        <CardContent className="mt-2 p-0">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(act.description),
            }}
            className="line-clamp-2 text-sm text-muted-foreground"
          />
        </CardContent>
        <div className="mt-2 text-sm font-medium text-gray-700">
          <span className="mr-4">Price: ${act.price.amount}</span>
          <span>
            Min Duration:{' '}
            {act.minimumDuration ? act.minimumDuration : '1 hours'}
          </span>
        </div>
      </div>
    </Card>
  );
};
