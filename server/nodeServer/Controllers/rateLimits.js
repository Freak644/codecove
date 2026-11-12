import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "./src/config/redis.js";

const createRedisStore = (prefix) => new RedisStore({
    prefix,
    // This project uses node-redis (not ioredis).
    sendCommand: (...args) => redis.sendCommand(args),
});

const makeRateLimitResponse = (code, message) => ({
    success: false,
    code,
    message,
});

/**
 * IP-based limiter. express-rate-limit's default key generator uses req.ip
 * and applies its IPv6-safe handling. Keep each limiter's Redis prefix
 * separate so policies do not accidentally share counters.
 */
const createIpRateLimiter = ({
    prefix,
    windowMs,
    max,
    code = "IP_RATE_LIMITED",
    message = "Too many requests. Please slow down.",
}) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore(prefix),
    message: makeRateLimitResponse(code, message),
});

const getRouteIdentity = (req) => {
    const routePath = req.route?.path;
    const routePart = typeof routePath === "string"
        ? routePath
        : req.path;

    // baseUrl contains the mounted router prefix (e.g. /writePost).
    // Do not include query strings or user-provided parameter values.
    const fullPath = `${req.baseUrl || ""}${routePart || "/unknown"}`;
    return `${req.method}:${fullPath.replace(/\/{2,}/g, "/")}`;
};

/**
 * User + endpoint limiter. Apply this AFTER Auth, because Auth sets
 * req.authData = tokenData and tokenData.id is the authenticated user ID.
 */
const createUserEndpointRateLimiter = ({
    prefix,
    windowMs,
    max,
    code = "USER_RATE_LIMITED",
    message = "You are sending requests too quickly. Please slow down.",
}) => {
    const limiter = rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        store: createRedisStore(prefix),
        keyGenerator: (req) => {
            const userId = req.authData?.id;

            // This middleware must be mounted after Auth. Fail closed if
            // the expected authentication context is missing.
            if (userId === undefined || userId === null || userId === "") {
                throw new Error(
                    "Authenticated rate limiter used before Auth or without req.authData.id"
                );
            }

            return `${String(userId)}:${getRouteIdentity(req)}`;
        },
        message: makeRateLimitResponse(code, message),
    });

    return (req, res, next) => {
        if (
            req.authData?.id === undefined ||
            req.authData?.id === null ||
            req.authData?.id === ""
        ) {
            return res.status(401).json({
                success: false,
                code: "AUTH_CONTEXT_MISSING",
                message: "Authentication is required for this operation.",
            });
        }

        return limiter(req, res, next);
    };
};

// Public / unauthenticated endpoint policies (per client IP).
export const loginIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:login:",
    windowMs: 15 * 60 * 1000,
    max: 10,
    code: "LOGIN_RATE_LIMITED",
    message: "Too many login attempts. Please try again later.",
});

export const oauthStartIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:oauth-start:",
    windowMs: 60 * 1000,
    max: 20,
    code: "OAUTH_RATE_LIMITED",
    message: "Too many OAuth attempts. Please try again shortly.",
});

export const oauthCallbackIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:oauth-callback:",
    windowMs: 60 * 1000,
    max: 30,
    code: "OAUTH_CALLBACK_RATE_LIMITED",
    message: "Too many OAuth callbacks. Please try again shortly.",
});

export const mergeTokenIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:merge-token:",
    windowMs: 60 * 1000,
    max: 10,
    code: "MERGE_TOKEN_RATE_LIMITED",
    message: "Too many merge-token checks. Please try again shortly.",
});

export const checkAuthIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:check-auth:",
    windowMs: 60 * 1000,
    max: 60,
    code: "AUTH_STATUS_RATE_LIMITED",
    message: "Too many authentication-status checks.",
});

export const verifyPasswordIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:verify-password:",
    windowMs: 5 * 60 * 1000,
    max: 10,
    code: "PASSWORD_VERIFY_RATE_LIMITED",
    message: "Too many password verification attempts.",
});

export const usernameCheckLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:username:",
    windowMs: 10 * 1000,
    max: 50,
    code: "USERNAME_CHECK_RATE_LIMITED",
    message: "Too many username checks. Please slow down.",
});

export const registrationIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:registration:",
    windowMs: 60 * 60 * 1000,
    max: 5,
    code: "REGISTRATION_RATE_LIMITED",
    message: "Too many registration attempts. Please try again later.",
});

export const EmailRateLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:email-send:",
    windowMs: 120 * 1000,
    max: 5,
    code: "EMAIL_SEND_RATE_LIMITED",
    message: "Too many email requests. Please slow down.",
});

export const verifyEmailLiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:verify-email:",
    windowMs: 10 * 1000,
    max: 10,
    code: "EMAIL_VERIFY_RATE_LIMITED",
    message: "Too many email verification attempts.",
});

export const passwordRecoveryIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:password-recovery:",
    windowMs: 15 * 60 * 1000,
    max: 5,
    code: "PASSWORD_RECOVERY_RATE_LIMITED",
    message: "Too many password recovery attempts. Please try again later.",
});

export const publicReadIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:public-read:",
    windowMs: 60 * 1000,
    max: 120,
    code: "PUBLIC_READ_RATE_LIMITED",
    message: "Too many requests. Please slow down.",
});

export const passwordChangeIpLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:password-change:",
    windowMs: 10 * 60 * 1000,
    max: 5,
    code: "PASSWORD_CHANGE_RATE_LIMITED",
    message: "Too many password-change attempts.",
});

// Authenticated policies are keyed by user ID + HTTP method + route template.
// Reusing one limiter across routes still gives each endpoint its own bucket.
export const userReadLimiter = createUserEndpointRateLimiter({
    prefix: "codecove:ratelimit:v2:user:read:",
    windowMs: 60 * 1000,
    max: 300,
});

export const userWriteLimiter = createUserEndpointRateLimiter({
    prefix: "codecove:ratelimit:v2:user:write:",
    windowMs: 60 * 1000,
    max: 60,
});

export const userUploadLimiter = createUserEndpointRateLimiter({
    prefix: "codecove:ratelimit:v2:user:upload:",
    windowMs: 10 * 60 * 1000,
    max: 10,
    code: "USER_UPLOAD_RATE_LIMITED",
    message: "Too many uploads. Please try again later.",
});

// Backward-compatible export only. Do not put this broad IP limiter in
// commonStack; new routes should choose an endpoint-specific policy above.
export const RateLimiter = createIpRateLimiter({
    prefix: "codecove:ratelimit:v2:ip:legacy-general:",
    windowMs: 60 * 1000,
    max: 300,
});
