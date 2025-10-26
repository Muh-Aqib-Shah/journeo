import type { z } from 'zod';

import type { CreateTripSchema } from '../schema/create-trip';

export type CreateTripType = z.infer<typeof CreateTripSchema>;
