import { z } from 'zod';

const SignupSchema = z.object({
  username: z.string({ required_error: 'This field is required' }).optional(),
  email: z
    .string({ required_error: 'This field is required' })
    .email('Invalid email'),
  password: z
    .string({ required_error: 'This field is required' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, {
      message: 'Password must contain at least one special character',
    }),
});

const SigninSchema = z.object({
  email: z
    .string({ required_error: 'This field is required' })
    .email('Invalid email'),
  password: z.string({ required_error: 'This field is required' }),
});

export { SigninSchema, SignupSchema };
