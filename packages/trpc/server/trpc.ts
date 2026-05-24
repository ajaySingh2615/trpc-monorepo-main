import { initTRPC } from "@trpc/server";
import type { Content } from "./context";

const t = initTRPC.context<Content>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
