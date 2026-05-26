import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().describe("The title of the form"),
  description: z.string().max(300).describe("The description of the form").optional(),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
});

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("The unique identifier of the form"),
    title: z.string().describe("The title of the form"),
    description: z.string().nullable().optional().describe("The description of the form"),
    createdBy: z.string().nullable().optional().describe("The id of the user who created the form"),
    createdAt: z.date().nullable().optional().describe("When the form was created"),
    updatedAt: z.date().nullable().optional().describe("When the form was last updated"),
  }),
);

const fieldTypeEnumModel = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const createFieldInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form this field belongs to"),
  label: z.string().min(1).max(100).describe("The label of the field"),
  description: z.string().optional().describe("Optional description for the field"),
  placeholder: z.string().optional().describe("Optional placeholder text"),
  isRequired: z.boolean().default(false).describe("Whether the field is required").default(false),
  index: z.string().describe("Fractional index for sorting"),
  type: fieldTypeEnumModel.describe("The type of the field"),
});

export const createFieldOutputModel = z.object({
  id: z.string().uuid().describe("ID of the newly created field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().uuid().describe("ID of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().uuid().describe("ID of the deleted field"),
});

export const updateFieldInputModel = z.object({
  id: z.string().uuid().describe("ID of the field to update"),
  label: z.string().min(1).max(100).optional().describe("Updated label"),
  description: z.string().optional().nullable().describe("Updated description"),
  placeholder: z.string().optional().nullable().describe("Updated placeholder"),
  isRequired: z.boolean().optional().describe("Updated required status"),
  index: z.string().optional().describe("Updated fractional index"),
  type: fieldTypeEnumModel.optional().describe("Updated field type"),
});

export const updateFieldOutputModel = z.object({
  id: z.string().uuid().describe("ID of the updated field"),
});

export const getFieldsByFormIdInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form whose fields should be listed"),
});

export const getFieldsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("ID of the field"),
    label: z.string().describe("Label of the field"),
    labelKey: z.string().describe("Slugified label key"),
    description: z.string().nullable().optional().describe("Description for the field"),
    placeholder: z.string().nullable().optional().describe("Placeholder text"),
    isRequired: z.boolean().describe("Whether the field is required"),
    index: z.string().describe("Fractional index"),
    type: fieldTypeEnumModel.describe("Field type"),
    formId: z.string().uuid().nullable().optional().describe("ID of the form"),
    createdAt: z.date().nullable().optional().describe("Creation time"),
    updatedAt: z.date().nullable().optional().describe("Last updated time"),
  }),
);

export const getFormByIdInputModel = z.object({
  id: z.string().uuid().describe("ID of the form to retrieve"),
});

export const getFormByIdOutputModel = z.object({
  id: z.string().uuid().describe("The unique identifier of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().optional().describe("The description of the form"),
  createdBy: z.string().nullable().optional().describe("The id of the user who created the form"),
  createdAt: z.date().nullable().optional().describe("When the form was created"),
  updatedAt: z.date().nullable().optional().describe("When the form was last updated"),
  fields: getFieldsByFormIdOutputModel,
});

export const submitFormInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form being submitted"),
  values: z.array(z.object({
    formFieldId: z.string().uuid(),
    value: z.string()
  })).describe("Submitted field values"),
});

export const submitFormOutputModel = z.object({
  id: z.string().uuid().describe("ID of the created submission"),
});

export const getSubmissionsByFormIdInputModel = z.object({
  formId: z.string().uuid().describe("ID of the form to retrieve submissions for"),
});

export const getSubmissionsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("ID of the submission"),
    formId: z.string().uuid().nullable().optional().describe("ID of the form"),
    values: z.any().describe("The submitted values array"),
    createdAt: z.date().nullable().optional().describe("When the submission was created"),
    updatedAt: z.date().nullable().optional().describe("When the submission was last updated"),
  })
);
