import { createClient } from "redis";
import chalk from 'chalk';
const redis = createClient({
  url: "redis://localhost:3224"
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