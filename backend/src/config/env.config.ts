import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
    // General application settings
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().url(),
    JWT_SECRET_KEY: z.string().min(32),
    REFRESH_SECRET_KEY: z.string().min(32),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    FRONTEND_URL: z.string().url(),

    RESEND_API_KEY: z.string(),

    // Khalti configuration
    KHALTI_LIVE_SECRET_KEY: z.string(),
    KHALTI_LIVE_PUBLIC_KEY: z.string(),
    KHALTI_PAYMENT_URL: z
        .string()
        .url()
        .default('https://khalti.com/api/v2/epayment/initiate/'),
    KHALTI_LOOKUP_URL: z
        .string()
        .url()
        .default('https://khalti.com/api/v2/epayment/lookup/'),

    // eSewa configuration
    ESEWA_MERCHANT_CODE: z.string().default('EPAYTEST'),
    ESEWA_SECRET_KEY: z.string().min(1, 'eSewa secret key is required'),
    ESEWA_PAYMENT_URL: z
        .string()
        .url()
        .default('https://rc-epay.esewa.com.np/api/epay/main/v2/form'),

    // payments success and failure url
    SUCCESS_URL: z
        .string()
        .url()
        .default('http://localhost:3000/api/payments/success'),
    FAILURE_URL: z
        .string()
        .url()
        .default('http://localhost:3000/api/payments/failure'),

    //cloudinary urls
    CLOUD_NAME: z.string(),
    API_KEY: z.string(),
    API_SECRET: z.string()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;