/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */

'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import type { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchWithAuth } from '@/lib/auth';
import type { CreateTripType } from '@/lib/types/create-trip';
import { cn } from '@/lib/utils';

import { Toggle } from '../ui/toggle';

interface Props {
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
  watch: UseFormWatch<CreateTripType>;
  setCoords: any;
}

interface SuggestionTypes {
  name: String;
  city: String;
  country: String;
  geoCode: { latitude: Number; longitude: Number };
}

const DestinationDetails: React.FC<Props> = ({
  stepfn,
  control,
  trigger,
  watch,
  setCoords,
}) => {
  const [suggestions, setSuggestions] = useState<null | SuggestionTypes[]>();
  const [selected, setSelected] = useState<String>('');

  const onSubmit = async () => {
    const res = await trigger([
      'destination',
      'name',
      'description',
      'visibility',
    ]);
    if (res) {
      stepfn(2);
    }
  };

  const destination = watch('destination');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!destination || destination.length < 2 || destination === selected)
      return;

    const delayDebounce = setTimeout(async () => {
      const res = await fetchWithAuth(
        `/api/search-destinations?query=${destination}`,
      );
      const data = await res.json();
      setSuggestions(data);
    }, 300);

    return function cleanup(): void {
      clearTimeout(delayDebounce);
    };
  }, [destination]);

  return (
    <>
      <div className="text-center text-2xl sm:text-4xl">Create Vacation</div>

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trip name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="e.g Vacation in Greece"
                  className="px-9 "
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <div ref={wrapperRef} className="relative">
                <MagnifyingGlassIcon className="absolute left-0 top-3 mx-3" />
                <Input
                  placeholder="Where to?"
                  className="px-9"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />

                {suggestions && suggestions.length > 0 && (
                  <div className="absolute top-12 z-20 w-full rounded-md border bg-white shadow">
                    {suggestions.map((place, idx) => (
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            setSelected(place.city);
                          field.onChange(place.city);
                          setCoords(place.geoCode);
                          setSuggestions(null);
                        }}
                        key={idx}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSelected(place.city);
                          field.onChange(place.city);
                          setCoords(place.geoCode);
                          setSuggestions(null);
                        }}
                      >
                        <p className="font-medium">{place.city}</p>
                        <p className="text-xs text-gray-500">{place.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                placeholder="Tell us about your trip..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <div className="w-full space-y-2 pt-4">
              <FormLabel className="block text-sm font-semibold">
                Share Vacation with Others?
              </FormLabel>
              <FormControl>
                <Toggle
                  size="sm"
                  aria-label="visibility toggle"
                  className={cn(!field.value && 'text-red-400')}
                  onPressedChange={(value) => field.onChange(value)}
                  pressed={field.value}
                >
                  {field.value ? 'Yes' : ' No'}
                </Toggle>
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <div className="flex justify-end pt-6">
        <Button type="button" className="w-full" onClick={onSubmit}>
          Next
        </Button>
      </div>
    </>
  );
};

export default DestinationDetails;
