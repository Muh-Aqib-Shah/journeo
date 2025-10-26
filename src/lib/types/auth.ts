import type { z } from 'zod';

import type { SigninSchema, SignupSchema } from '../schema/auth';

export type SignupType = z.infer<typeof SignupSchema>;
export type SigninType = z.infer<typeof SigninSchema>;
