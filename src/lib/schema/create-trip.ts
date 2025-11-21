import { differenceInCalendarDays, isAfter } from 'date-fns';
import { z } from 'zod';

export const CreateTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().min(1, 'Destination is required'),
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
  times: z
    .object({
      start: z.number(),
      end: z.number(),
    })
    .refine((elem) => elem.start && elem.end, {
      message: 'Timings are required',
    }),
  visibility: z.boolean(),
  flightFrom: z.string().min(1, 'City name is required'),
  flightTo: z.string().min(1, 'City name is required'),
  flightDate: z.date(),
  flightNo: z.string().min(1, 'Flight number is required'),
  ticektNo: z.string().min(1, 'Ticket number is required'),
  hotelBooking: z.string().min(1, 'Booking confirmation is required'),
  hotelName: z.string().min(1, 'Hotel name is required'),
  hotelPhone: z
    .string()
    .regex(/^\+\d{1,3}-\d{7,15}$/, {
      message: 'Invalid phone number format\nExample: +91-1234567890',
    })
    .optional(),
  hotelLocation: z.string().min(1, 'Location is required'),
  checkIn: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .refine(({ start, end }) => start && end && isAfter(end, start), {
      message: 'Check-out date must be after check-in date',
      path: ['end'],
    }),
});
