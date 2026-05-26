import { z } from "zod";

const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const createFieldInput = z.object({
  formId: z.string().uuid().describe("ID of the form this field belongs to"),
  label: z.string().min(1).max(100).describe("The label of the field"),
  description: z.string().optional().describe("Optional description for the field"),
  placeholder: z.string().optional().describe("Optional placeholder text"),
  isRequired: z.boolean().default(false).describe("Whether the field is required"),
  index: z.string().describe("Fractional index for sorting"),
  type: fieldTypeEnum.describe("The type of the field"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const deleteFieldInput = z.object({
  id: z.string().uuid().describe("ID of the field to delete"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const updateFieldInput = z.object({
  id: z.string().uuid().describe("ID of the field to update"),
  label: z.string().min(1).max(100).optional().describe("Updated label"),
  description: z.string().optional().nullable().describe("Updated description"),
  placeholder: z.string().optional().nullable().describe("Updated placeholder"),
  isRequired: z.boolean().optional().describe("Updated required status"),
  index: z.string().optional().describe("Updated fractional index"),
  type: fieldTypeEnum.optional().describe("Updated field type"),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const getFieldsByFormIdInput = z.object({
  formId: z.string().uuid().describe("ID of the form whose fields should be listed"),
});

export type GetFieldsByFormIdInputType = z.infer<typeof getFieldsByFormIdInput>;
