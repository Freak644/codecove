import { error } from "console";
import rateLimit from "express-rate-limit";
let msg="Too many Request Slow down";

const usernameCheckLimiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 5,
  message: { error: "Too many checks, slow down" }
});

const EmailRateLimiter = rateLimit({
  windowMs:60 * 1000,
  max:1,
  message:{error: msg}
});

const verifyEmailLiter = rateLimit({
  windowMs:10 * 1000,
  max:5,
  message: {error:msg}
})

const RateLimiter = rateLimit({
  windowMs:10 * 1000,
  max:20,
  message: {error:msg}
})


export {usernameCheckLimiter, EmailRateLimiter, verifyEmailLiter,RateLimiter}