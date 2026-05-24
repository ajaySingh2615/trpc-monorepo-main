import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("8000"),
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
