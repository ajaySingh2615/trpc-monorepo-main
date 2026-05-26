import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1).describe("Secret used to sign JWT access tokens"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
