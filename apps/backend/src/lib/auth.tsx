import { isProduction } from "@filmato/utils";
import { pretty, render } from "@react-email/render";
import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { env } from "../config/env.config.js";
import { authLogger } from "../config/loggers.config.js";
import db from "../db/index.js";
import { account, accountRelations, session, sessionRelations, user, userRelations, verification } from "../db/schema/better-auth/auth-schema.js";
import PasswordChanged from "../emails/auth/password-changed.js";
import ResetPassword from "../emails/auth/reset-password.js";
import SignInAlert from "../emails/auth/sign-in-alert.js";
import VerifyEmail from "../emails/auth/verify-email.js";
import redis from "../lib/redis.js";
import resend from "../lib/resend.js";

const PREFIX = `${env?.UPSTASH_REDIS_NAMESPACE}:auth`

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification, userRelations, accountRelations, sessionRelations }
    }),
    socialProviders: {
        google: {
            clientId: env.GOOGLE_OAUTH_CLIENT_ID as string,
            clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent"
        }
    },
    emailAndPassword: {
        enabled: true,
        resetPasswordTokenExpiresIn: 60 * 10,
        sendResetPassword: async ({ user, url }) => {
            resend.emails.send({
                from: `Filmato <${env?.SYSTEM_EMAIL_ID}>`,
                to: [user?.email],
                subject: "Reset Password",
                html: await pretty(await render(<ResetPassword username={user?.name} resetUrl={url} />))
            }).then((res) => {
                if (res.error) {
                    authLogger.error(`Password reset email to ${user?.email} failed`, res.error);
                    return res.error;
                } else {
                    authLogger.info(`Password reset email sent to ${user.email}`, { id: res.data.id });
                    return res.data
                }
            })
        },
        onPasswordReset: async ({ user }) => {
            resend.emails.send({
                from: env?.SYSTEM_EMAIL_ID,
                to: [`${user?.email}`],
                subject: "Password Changed",
                html: await pretty(await render(<PasswordChanged username={user?.name} email={user?.email} resetUrl={`${env?.WEB_URL}/reset-password`} />))
            })
        },
        revokeSessionsOnPasswordReset: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            resend.emails.send({
                from: `Filmato <${env?.SYSTEM_EMAIL_ID}>`,
                to: [user?.email],
                subject: "Verfication for email",
                html: await pretty(await render(<VerifyEmail verificationUrl={url} username={user?.name} />))
            }).then((res) => {
                if (res.error) {
                    authLogger.error(`Failed to send verification email to ${user?.email}`, res.error);
                    return res.error;
                } else {
                    authLogger.info(`Verification email sent to ${user.email}`, { id: res.data.id });
                    return res.data;
                }
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 10,
            strategy: "jwt"
        },
        expiresIn: 60 * 60 * 7,

    },
    advanced: {
        cookiePrefix: 'filmato'
    },
    databaseHooks: {
        session: {
            create: {
                after: async (session, context) => {
                    const isSignIn = context?.path?.includes('/sign-in/email');
                    if (!isSignIn) return;
                    const [userData] = await db.select({
                        email: user.email,
                        name: user.name
                    }).from(user).where(eq(user.id, session.userId));

                    if (!userData) return;
                    
                    resend.emails.send({
                        from: `Filmato <${env?.SYSTEM_EMAIL_ID}>`,
                        to: [`${userData?.email}`],
                        subject: "New login to your Filmato account",
                        html: await pretty(await render(
                            <SignInAlert
                                username={userData?.name}
                                email={userData?.email}
                                ip={session.ipAddress}
                                resetUrl={`${env?.WEB_URL}/reset-password`}
                                time={`${session?.createdAt}`}
                                userAgent={session?.userAgent}
                            />))
                    }).then((res) => {
                        if (res.error) {
                            authLogger.error(`Failed to send sign in alert email to ${userData?.email}`, res.error);
                            return res.error;
                        } else {
                            authLogger.info(`Sign in alert email sent to ${userData.email} `, { id: res.data.id });
                            return res.data;
                        }
                    })
                },
            }
        }
    },
    trustedOrigins: env?.ORIGINS,
    rateLimit: {
        enabled: true,
        window: 60,
        max: 30,
        customRules: {
            '/sign-up/*': {
                window: 300,
                max: 5,
            },
            '/sign-in/*': {
                window: 300,
                max: 5
            },
            '/verify-email': {
                window: 900,
                max: 5
            },
            '/request-password-reset': {
                window: 300,
                max: 3
            },
            '/change-password': {
                window: 300,
                max: 3
            },
            "/send-verification-email": {
                window: 900,
                max: 5
            }
        },
        customStorage: {
            get: async (key) => {
                const result = await redis.get(`${PREFIX}:${key}`);
                return result as RateLimit
            },
            set: async (key, value) => {
                let TTL: number;
                if (key.includes("sign-in") || key.includes("request-password-reset") || key.includes("sign-up")) {
                    TTL = 315;
                } else if (key.includes("verify-email") || key.includes("send-verification-email")) {
                    TTL = 915;
                } else {
                    TTL = 75;
                }
                await redis.set(`${PREFIX}:${key}`, value, { ex: TTL });
            }
        }
    },
    logger: {
        level: isProduction(process.env.NODE_ENV) ? 'info' : 'debug',
        log: (level, message, ...args) => {
            switch (level) {
                case "info":
                    authLogger.info(message, ...args);
                    break;
                case "warn":
                    authLogger.warn(message, ...args);
                    break;
                case "error":
                    authLogger.error(message, ...args);
                    break;
                case "debug":
                    authLogger.debug(message, ...args);
            }
        }
    }
});