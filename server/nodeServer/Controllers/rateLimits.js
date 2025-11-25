import rateLimit from "express-rate-limit";

export const usernameCheckLimiter = rateLimit({
  windowMs: 10 * 1000, // 10s
  max: 5,
  message: { error: "Too many checks, slow down" }
});

