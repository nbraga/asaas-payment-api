import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().optional().default(3333),
    MAIL_FROM: z.string(),
    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_USER: z.string(),
    MAIL_PASS: z.string(),
    FRONTEND_URL: z.string(),
    ASAAS_API_KEY: z.string(),
    ASAAS_BASE_URL: z.string().url(),
    ASAAS_WEBHOOK_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
