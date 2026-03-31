import redis from "../config/redis.js";

const ROUTE_LIMITS = {
  "/login": { burst: 5, rate: 20 },
};

const DEFAULT_LIMIT = { burst: 30, rate: 100 };

export const checkRequest = async (req, res, next) => {

    const ip = req.userIp || req.ip;
    const route = req.originalUrl.split("?")[0];
    console.log("start"+route)
    const { burst, rate } = ROUTE_LIMITS[route] || DEFAULT_LIMIT;

    // 🧱 1. Block check
    if (await redis.exists(`block:${ip}`)) {
      return res.status(403).json({ err: "IP blocked" });
    }

    // 🔁 2. Duplicate prevention (still TTL based)
    const dupKey = `req:${ip}:${route}`;
    const isNew = await redis.set(dupKey, "1", {
      NX: true,
      EX: 15 // safety fallback
    });

    if (!isNew) {
      return res.status(429).json({ err: "Duplicate request" });
    }

    // ⚡ 3. TRUE concurrent request tracking
    const burstKey = `burst:${ip}`;
    const burstCount = await redis.incr(burstKey);

    if (burstCount === 1) {
      await redis.expire(burstKey, 60); // fallback cleanup
    }

    if (burstCount > burst) {
      await redis.set(`block:${ip}`, "1", { EX: 3600 });
      return res.status(429).json({ err: "Too many concurrent requests" });
    }

    // 📊 4. Rate limit (still TTL window-based)
    const rateKey = `rate:${ip}`;
    const rateCount = await redis.incr(rateKey);

    if (rateCount === 1) {
      await redis.expire(rateKey, 60);
    }

    if (rateCount > rate) {
      await redis.set(`block:${ip}`, "1", { EX: 3600 });
      return res.status(429).json({ err: "Rate limit exceeded" });
    }



    next();
};

export const completeRequest = async (ip, route) => {
  try {
    const dupKey = `req:${ip}:${route}`;
    const burstKey = `burst:${ip}`;
    console.log("close"+dupKey)
    // Remove duplicate lock immediately
    await redis.del(dupKey);

    // Decrease active request count
    const current = await redis.decr(burstKey);

    // Safety: prevent negative values
    if (current <= 0) {
      await redis.del(burstKey);
    }

  } catch (err) {
    console.error("CompleteRequest error:", err);
  }
};