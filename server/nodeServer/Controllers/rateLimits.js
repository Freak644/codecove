
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "./src/config/redis.js";

const msg = "Too many requests. Slow down.";

const createRedisStore = (prefix) => new RedisStore({
    prefix,
    sendCommand: (...args) => redis.sendCommand(args)
});

const usernameCheckLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 50,
    message: { error: "Too many checks, slow down." },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("codecove:ratelimit:username:")
});

const EmailRateLimiter = rateLimit({
    windowMs: 120 * 1000,
    max: 5,
    message: { error: msg },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("codecove:ratelimit:email:")
});

const verifyEmailLiter = rateLimit({
    windowMs: 10 * 1000,
    max: 10,
    message: { error: msg },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("codecove:ratelimit:verify-email:")
});

const RateLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 20,
    message: { error: msg },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore("codecove:ratelimit:general:")
});

export {
    usernameCheckLimiter,
    EmailRateLimiter,
    verifyEmailLiter,
    RateLimiter
};
