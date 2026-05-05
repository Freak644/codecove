import { createClient } from "redis";
import {REDIS_CONFIG} from './redisConfig.js';
import chalk from 'chalk';
const redis = createClient({
  url: `redis://${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log(chalk.bgBlack.greenBright("✅ Redis connected"));
  }
}

export default redis;