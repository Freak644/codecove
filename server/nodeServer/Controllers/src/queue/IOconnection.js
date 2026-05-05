import IORedis from 'ioredis';
import { REDIS_CONFIG } from '../config/redisConfig.js';

export const bullRedis = new IORedis({
     ...REDIS_CONFIG,
     maxRetriesPerRequest: null,
})