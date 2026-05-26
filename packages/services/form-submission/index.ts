import { db, eq, desc } from "@repo/database";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import {
  createFormSubmissionInput,
  type CreateFormSubmissionInputType,
  getSubmissionsByFormIdInput,
  type GetSubmissionsByFormIdInputType,
} from "./model";

class FormSubmissionService {
  public async submitForm(payload: CreateFormSubmissionInputType) {
    const { formId, values } = await createFormSubmissionInput.parseAsync(payload);

    const insertResult = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formSubmissionsTable.id,
      });

      if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
        throw new Error("Failed to save form submission");
      }

      return { id: insertResult[0].id };
  }

  public async getSubmissionsByFormId(payload: GetSubmissionsByFormIdInputType) {
    const { formId } = await getSubmissionsByFormIdInput.parseAsync(payload);

    const submissions = await db
      .select()
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(desc(formSubmissionsTable.createdAt));

    return submissions;
  }
}

export default FormSubmissionService;
