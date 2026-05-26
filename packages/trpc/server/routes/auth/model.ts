import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("The full name of the user"),
  email: z.email().describe("The email address of the user"),
  password: z.string().describe("The password for the user account"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("The unique identifier of the user"),
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
  email: z.email().describe("The email address of the user"),
  password: z.string().describe("The password for the user account"),
})

export const signInUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("The unique identifier of the user"),
});

export const getLoggedInUserInfoInputModel = z.undefined()
export const getLoggedInUserInfoOutputModel = z.object({
  id: z.string().describe("The unique identifier of the user"),
  email: z.email().describe("The email address of the user"),
  fullName: z.string().describe("The full name of the user"),
  profileImageUrl: z.string().describe("image of the user").optional().nullable(),
});

