import { z } from "zod";

export const formSubmissionValueInput = z.object({
  formFieldId: z.string().uuid().describe("ID of the form field"),
  value: z.string().describe("The submitted value as a string"),
});

export const createFormSubmissionInput = z.object({
  formId: z.string().uuid().describe("ID of the form being submitted"),
  values: z.array(formSubmissionValueInput).describe("The values submitted for the form fields"),
});

export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;

export const getSubmissionsByFormIdInput = z.object({
  formId: z.string().uuid().describe("ID of the form to retrieve submissions for"),
});

export type GetSubmissionsByFormIdInputType = z.infer<typeof getSubmissionsByFormIdInput>;
