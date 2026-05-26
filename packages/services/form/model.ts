import { z } from "zod";

export const createFormInput = z.object({
    title: z.string().min(1).max(55).describe("The title of the form"),
    description: z.string().max(500).optional().describe("Optional description for the form"),
    createdBy: z.string().uuid().describe("ID of the user who creates the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe("ID of the user whose forms should be listed"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;

export const formItem = z.object({
    id: z.string().uuid().describe("The unique identifier of the form"),
    title: z.string().min(1).max(55).describe("The title of the form"),
    description: z.string().max(500).nullable().optional().describe("The description of the form"),
    createdBy: z.string().uuid().describe("The id of the user who created the form"),
    createdAt: z.date().describe("When the form was created"),
    updatedAt: z.date().describe("When the form was last updated"),
});

export type FormItemType = z.infer<typeof formItem>;

export const listFormsByUserIdOutput = z.array(formItem);
export type ListFormsByUserIdOutputType = z.infer<typeof listFormsByUserIdOutput>;

export const getFormByIdInput = z.object({
    id: z.string().uuid().describe("ID of the form to retrieve"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;
