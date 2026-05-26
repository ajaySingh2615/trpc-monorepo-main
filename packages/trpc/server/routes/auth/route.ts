import { userService } from "@repo/services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
  setAuthenticationCookie,
  clearAuthenticationCookie,
  getAuthenticationCookie,
} from "../../utils/cookie";
import {
  signUpInputModel,
  signUpOutputModel,
  signInInputModel,
  signInOutputModel,
  getMeOutputModel,
} from "./model";
import { z } from "../../schema";

export const authRouter = router({
  signUp: publicProcedure
    .input(signUpInputModel)
    .output(signUpOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input;
      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName,
        email,
        password,
      });
      setAuthenticationCookie(ctx.res, token);
      return { id };
    }),

  signIn: publicProcedure
    .input(signInInputModel)
    .output(signInOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { id, token } = await userService.signInUserWithEmailAndPassword({
        email,
        password,
      });
      setAuthenticationCookie(ctx.res, token);
      return { id };
    }),

  signOut: publicProcedure
    .input(z.undefined())
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx }) => {
      clearAuthenticationCookie(ctx.res);
      return { success: true };
    }),

  me: authenticatedProcedure
    .output(getMeOutputModel)
    .query(async ({ ctx }) => {
      const user = await userService.getUserInfoById(ctx.user.id);
      return user;
    }),
});


