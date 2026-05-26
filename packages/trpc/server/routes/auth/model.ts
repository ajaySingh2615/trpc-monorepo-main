import { z } from "../../schema";

export const signUpInputModel = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpOutputModel = z.object({
  id: z.string().uuid(),
});

export const signInInputModel = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signInOutputModel = z.object({
  id: z.string().uuid(),
});

export const getMeOutputModel = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  profileImageUrl: z.string().nullable(),
});
