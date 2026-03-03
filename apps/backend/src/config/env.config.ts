import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
    BETTER_AUTH_URL: z.url().min(1, "BETTER_AUTH_URL is missing."),
    BETTER_AUTH_SECRET: z.string().regex(/^[A-Za-z0-9]{32}$/).min(1, "BETTER_AUTH_SECRET is missing."),
    GOOGLE_OAUTH_CLIENT_ID: z.string().nonempty("GOOGLE_OAUTH_CLIENT_ID is missing"),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().nonempty("GOOGLE_OAUTH_CLIENT_SECRET is missing"),
    DB_URL: z.url(),
    WEB_URL: z.url(),
    ADMIN_WEB_URL: z.url(),
    RESEND_API_KEY: z.string().startsWith("re_").regex(/^re_[A-Za-z0-9]+_[A-Za-z0-9]+$/, "RESEND_API_KEY is missing."),
    SYSTEM_EMAIL_ID: z.email().min(1, "SYSTEM_EMAIL_ID is missing."),
    UPSTASH_REDIS_REST_URL: z.url().min(1, "UPSTASH_REDIS_REST_URL is missing."),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is missing."),
    UPSTASH_REDIS_NAMESPACE: z.string().min(1, "UPSTASH_REDIS_NAMESPACE is missing."),
    PORT: z.coerce.number().default(3000),
    ORIGINS: z.string().transform((val) => val.split(',').map(el => el.trim()).filter(Boolean)).pipe(z.array(z.url()).nonempty("At least one valid origin is required."))
});

export const env = envSchema.parse(process.env)