import { db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";
import {
  createFieldInput,
  type CreateFieldInputType,
  deleteFieldInput,
  type DeleteFieldInputType,
  updateFieldInput,
  type UpdateFieldInputType,
  getFieldsByFormIdInput,
  type GetFieldsByFormIdInputType,
} from "./model";

class FormFieldService {
  private generateLabelKey(label: string): string {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  private async getFormById(id: string) {
    const result = await db.select().from(formsTable).where(eq(formsTable.id, id));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async getFieldById(id: string) {
    const result = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, id));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  public async getFieldsByFormId(payload: GetFieldsByFormIdInputType) {
    const { formId } = await getFieldsByFormIdInput.parseAsync(payload);
    const form = await this.getFormById(formId);
    if (!form) throw new Error(`Form with id ${formId} does not exist`);

    const fields = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        placeholder: formFieldsTable.placeholder,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        formId: formFieldsTable.formId,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    return fields;
  }

  public async createField(payload: CreateFieldInputType) {
    const { formId, label, description, placeholder, isRequired, index, type } =
      await createFieldInput.parseAsync(payload);

    const form = await this.getFormById(formId);
    if (!form) throw new Error(`Form with id ${formId} does not exist`);

    const labelKey = this.generateLabelKey(label);

    const insertResult = await db
      .insert(formFieldsTable)
      .values({ formId, label, labelKey, description, placeholder, isRequired, index, type })
      .returning({ id: formFieldsTable.id });

    if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
      throw new Error(`Failed to create field`);
    }

    return { id: insertResult[0].id };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const existingField = await this.getFieldById(id);
    if (!existingField) throw new Error(`Field with id ${id} does not exist`);

    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, id));

    return { id };
  }

  public async updateField(payload: UpdateFieldInputType) {
    const { id, ...updates } = await updateFieldInput.parseAsync(payload);

    const existingField = await this.getFieldById(id);
    if (!existingField) throw new Error(`Field with id ${id} does not exist`);

    // Build the update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (updates.label !== undefined) updateData.label = updates.label;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.placeholder !== undefined) updateData.placeholder = updates.placeholder;
    if (updates.isRequired !== undefined) updateData.isRequired = updates.isRequired;
    if (updates.index !== undefined) updateData.index = updates.index;
    if (updates.type !== undefined) updateData.type = updates.type;

    if (Object.keys(updateData).length === 0) {
      throw new Error(`No fields to update`);
    }

    const updateResult = await db
      .update(formFieldsTable)
      .set(updateData)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!updateResult || updateResult.length === 0 || !updateResult[0]) {
      throw new Error(`Failed to update field with id ${id}`);
    }

    return { id: updateResult[0].id };
  }
}

export default FormFieldService;
