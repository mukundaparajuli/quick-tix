import { z } from 'zod';

export const RegisterSchema = z
    .object({
        fullName: z.string().min(1, { message: 'Full name is required' }),
        username: z.string().min(1, { message: 'Username is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        businessName: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine(
        (data) => (data.businessName ? data.businessName.length > 0 : true),
        {
            message: 'Business name is required for organizers',
            path: ['businessName'],
        }
    );

export type RegisterFormData = z.infer<typeof RegisterSchema>;