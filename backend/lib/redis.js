import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
//key-value store
// await client.set('foo', 'bar');