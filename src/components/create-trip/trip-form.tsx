'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Control, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { fetchWithAuth } from '@/lib/auth';
import { CreateTripSchema } from '@/lib/schema/create-trip';
import type { Coordinates, CreateTripType } from '@/lib/types/create-trip';

import { Form } from '../ui/form';
import DestinationDetails from './destination-details';
import IteinaryDetails from './iteinary-details';

function MountFormPage({
  step,
  stepfn,
  control,
  watch,
  trigger,
  btnState,
  coords,
  setCoords,
}: {
  step: number;
  stepfn: (num: number) => void;
  control: Control<CreateTripType>;
  trigger: UseFormTrigger<CreateTripType>;
  watch: UseFormWatch<CreateTripType>;
  btnState: boolean;
  coords: Coordinates | null;
  setCoords: any;
}): ReactNode {
  switch (step) {
    case 1:
      return (
        <DestinationDetails
          stepfn={stepfn}
          control={control}
          trigger={trigger}
          watch={watch}
          setCoords={setCoords}
        />
      );
    case 2:
      return (
        <IteinaryDetails
          stepfn={stepfn}
          control={control}
          watch={watch}
          btnState={btnState}
          coords={coords}
        />
      );
    default:
      stepfn(1);
  }
}

export default function TripForm() {
  const [formStep, setFormStep] = useState<number>(1);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [latNlong, setLatNlong] = useState<null | Coordinates>(null);

  const router = useRouter();

  const form = useForm<CreateTripType>({
    defaultValues: {
      destination: '',
      duration: { from: new Date(), to: addDays(new Date(), 1) },
      visibility: true,
      name: '',
      iteinary: [],
    },
    resolver: zodResolver(CreateTripSchema),
  });

  const { control, watch, handleSubmit, trigger } = form;

  const onSubmit = async (values: CreateTripType) => {
    setDisableBtn(true);
    try {
      const data = await fetchWithAuth('/api/create-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const responseText = await data.text();
      let response;
      try {
        response = JSON.parse(responseText);
      } catch (parseError) {
        toast.error('Server returned invalid response', {
          className: '!text-red-700',
        });
        setDisableBtn(false);
        return;
      }

      if (response.error) {
        toast.error(response.error, { className: '!text-red-700' });
      } else if (response.success === false) {
        toast.error(response.error || 'Failed to create trip', {
          className: '!text-red-700',
        });
      } else if (response.message?.includes('not logged')) {
        toast.warning('Uh oh! You are not logged in!', {
          className: '!text-yellow-700',
        });
      } else if (response.success === true) {
        toast.success('Trip created successfully!', {
          className: '!text-green-700',
        });
        router.push('/trips');
      } else {
        toast.success('Trip created successfully!', {
          className: '!text-green-700',
        });
      }
    } catch (error) {
      toast.error(
        `Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { className: '!text-red-700' },
      );
    }
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
              control={control}
              watch={watch}
              trigger={trigger}
              btnState={disableBtn}
              coords={latNlong}
              setCoords={setLatNlong}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
