import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export interface TRPCContext {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  return { req, res };
}

export type Content = Awaited<ReturnType<typeof createContext>>;
