import { z } from "../../schema";
import { publicProcedure, router } from "../../trpc";

export const healthRouter = router({
  getHealth: publicProcedure
    .input(z.undefined())
    .output(
      z.object({
        status: z.literal("Healthy"),
      }),
    )
    .query(async () => {
      return { status: "Healthy" };
    }),
});
