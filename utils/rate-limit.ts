import redis from "./redis-client.js";

export async function checkRateLimit(fid: string): Promise<boolean> {
  const key = `ratelimit:intro:${fid}`;
  const result = await redis.set(key, "true", "EX", 600, "NX");
  return result === "OK";
}
