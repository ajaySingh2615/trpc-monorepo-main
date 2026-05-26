import { initTRPC, TRPCError } from "@trpc/server";
import type { Content } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "@repo/services";

const t = initTRPC.context<Content>().create();

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const token = getAuthenticationCookie(ctx.req);
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in.",
    });
  }

  try {
    const { id } = await userService.verifyAndDecodeUserToken(token);
    return next({
      ctx: {
        ...ctx,
        user: { id },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token.",
    });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(isAuthenticated);

