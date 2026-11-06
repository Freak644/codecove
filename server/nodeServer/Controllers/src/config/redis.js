import { createClient } from "redis";
import {REDIS_CONFIG} from './redisConfig.js';
import chalk from 'chalk';
const redis = createClient({
    socket: {
        host: REDIS_CONFIG.host,
        port: REDIS_CONFIG.port
    },
    password: REDIS_CONFIG.password
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