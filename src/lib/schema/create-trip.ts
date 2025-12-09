import { differenceInCalendarDays } from 'date-fns';
import { z } from 'zod';

const ActivitySchema = z.object({
  name: z.string().min(1, 'Activity Name is required'),
  description: z.string().min(1, 'Activity Description is required'),
  pictures: z.array(z.string()),
  price: z.object({
    amount: z.number(),
    currencyCode: z.string(),
  }),
  geoCode: z.object({ latitude: z.number(), longitude: z.number() }),
  minimumDuration: z.string().min(1, 'Duration are required'),
});

const IteinarySchema = z.array(
  z.object({
    day: z.number(),
    date: z.date(),
    activities: z
      .array(ActivitySchema)
      .min(1, 'Atleast one activity is required'),
  }),
);

const CreateTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().min(1, 'Destination is required'),
  description: z.string().min(20, 'Description must be 20 characters long'),
  duration: z
    .object({
      to: z.date(),
      from: z.date(),
    })
    .refine(
      (duration) =>
        duration.from &&
        duration.to &&
        differenceInCalendarDays(duration.to, duration.from) <= 90,
      {
        message: 'The duration must be within 90 days time period.',
      },
    ),
  visibility: z.boolean(),
  total_days: z.number().optional(),
  cover_img: z.string().optional(),
  budget_estimate: z.number().optional(),

  iteinary: IteinarySchema,
});

export { ActivitySchema, CreateTripSchema, IteinarySchema };
