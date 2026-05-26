import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import FormService from "../../../../services/form";
import FormFieldService from "../../../../services/form-field";
import FormSubmissionService from "../../../../services/form-submission";
import {
  createFormInputModel,
  createFormOutputModel,
  listFormsOutputModel,
  createFieldInputModel,
  createFieldOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
  getFieldsByFormIdInputModel,
  getFieldsByFormIdOutputModel,
  getFormByIdInputModel,
  getFormByIdOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  getSubmissionsByFormIdInputModel,
  getSubmissionsByFormIdOutputModel,
} from "./model";

const TAGS = ["Forms"];
const getPath = generatePath("/form");

const formService = new FormService();
const formFieldService = new FormFieldService();
const formSubmissionService = new FormSubmissionService();

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/createForm"), tags: TAGS, protect: true },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { id } = await formService.createForm({
        ...input,
        createdBy: ctx.user.id,
      });

      return { id };
    }),

  listForms: authenticatedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/listForms"), tags: TAGS, protect: true },
    })
    .input(z.undefined())
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });

      return forms;
    }),

  getFieldsByFormId: publicProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getFieldsByFormId"), tags: TAGS, protect: false },
    })
    .input(getFieldsByFormIdInputModel)
    .output(getFieldsByFormIdOutputModel)
    .query(async ({ input }) => {
      const fields = await formFieldService.getFieldsByFormId({
        formId: input.formId,
      });
      return fields;
    }),

  getFormById: publicProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getFormById"), tags: TAGS, protect: false },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => {
      const form = await formService.getFormById({
        id: input.id,
      });
      return form;
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/createField"), tags: TAGS, protect: true },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const result = await formFieldService.createField(input);
      return result;
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: { method: "PATCH", path: getPath("/updateField"), tags: TAGS, protect: true },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const result = await formFieldService.updateField(input);
      return result;
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: { method: "DELETE", path: getPath("/deleteField"), tags: TAGS, protect: true },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const result = await formFieldService.deleteField(input);
      return result;
    }),

  submitForm: publicProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/submitForm"), tags: TAGS, protect: false },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      const result = await formSubmissionService.submitForm(input);
      return result;
    }),

  getSubmissionsByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getSubmissionsByFormId"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getSubmissionsByFormIdInputModel)
    .output(getSubmissionsByFormIdOutputModel)
    .query(async ({ input }) => {
      const submissions = await formSubmissionService.getSubmissionsByFormId({
        formId: input.formId,
      });
      return submissions;
    }),
});
