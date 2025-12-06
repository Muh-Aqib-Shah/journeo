import type { z } from 'zod';

import type {
  ActivitySchema,
  CreateTripSchema,
  IteinarySchema,
} from '../schema/create-trip';

export type CreateTripType = z.infer<typeof CreateTripSchema>;

export type ActivityType = z.infer<typeof ActivitySchema>;

export type IteinaryType = z.infer<typeof IteinarySchema>;

export type Coordinates = { latitude: number; longitude: number };
