'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CreateTripSchema } from '@/lib/schema/create-trip';
import type { CreateTripType } from '@/lib/types/create-trip';

import { Form } from '../ui/form';
import DestinationDetails from './destination-details';
import FlightDetails from './flight-details';
import HotelDetails from './hotel-details';

function MountFormPage({
  step,
  stepfn,
  setValue,
  control,
  trigger,
  btnState,
}: {
  step: number;
  stepfn: (num: number) => void;
  setValue: UseFormSetValue<CreateTripType>;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
  btnState: boolean;
}): ReactNode {
  switch (step) {
    case 1:
      return (
        <DestinationDetails
          stepfn={stepfn}
          setValue={setValue}
          control={control}
          trigger={trigger}
        />
      );
    case 2:
      return (
        <FlightDetails stepfn={stepfn} control={control} trigger={trigger} />
      );
    case 3:
      return (
        <HotelDetails stepfn={stepfn} control={control} btnState={btnState} />
      );
    default:
      stepfn(1);
  }
}

export default function TripForm() {
  const [formStep, setFormStep] = useState<number>(1);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const form = useForm<CreateTripType>({
    defaultValues: {
      destination: '',
      duration: { from: new Date(), to: addDays(new Date(), 1) },
      visibility: true,
      flightFrom: '',
      flightTo: '',
      flightNo: '',
      ticektNo: '',
      hotelBooking: '',
      hotelName: '',
      hotelLocation: '',
    },
    resolver: zodResolver(CreateTripSchema),
  });

  const { control, handleSubmit, trigger, setValue } = form;

  const onSubmit = async (values: CreateTripType) => {
    setDisableBtn(true);
    const data = await fetch('/api/create-trip/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const response = await data.json();

    if (response.error)
      toast.error('Internal server error', { className: '!text-red-700' });
    else if (response.message.includes('not logged'))
      toast.warning('Uh oh! You are not logged in!', {
        className: '!text-yellow-700',
      });
    else
      toast.success('Form submitted successfully.', {
        className: '!text-green-700',
      });
    setDisableBtn(false);
  };

  return (
    <div className="w-[300px] xs:w-[400px] sm:w-[600px]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <MountFormPage
              step={formStep}
              stepfn={setFormStep}
              setValue={setValue}
              control={control}
              trigger={trigger}
              btnState={disableBtn}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
