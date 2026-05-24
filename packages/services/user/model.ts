import { z } from "zod";

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
  typeof createUserWithEmailAndPasswordInput
>;

export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignInUserWithEmailAndPasswordInputType = z.infer<
  typeof signInUserWithEmailAndPasswordInput
>;

export const generateUserTokenPayload = z.object({
  id: z.string().uuid(),
});

export type GenerateUserTokenPayloadType = z.infer<
  typeof generateUserTokenPayload
>;
