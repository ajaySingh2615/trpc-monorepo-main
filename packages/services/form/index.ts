import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { usersTable } from "@repo/database/models/user";
import {
    createFormInput,
    type CreateFormInputType,
    listFormsByUserIdInput,
    type ListFormsByUserIdInputType,
    getFormByIdInput,
    type GetFormByIdInputType,
} from "./model";

class FormService {
    private async getUserById(id: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if (!result || result.length === 0) return null;
        return result[0];
    }

    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        const user = await this.getUserById(createdBy);
        if (!user) throw new Error(`User with id ${createdBy} does not exist`);

        const insertResult = await db
            .insert(formsTable)
            .values({ title, description, createdBy })
            .returning({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdBy: formsTable.createdBy,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
            });

        if (!insertResult || insertResult.length === 0 || !insertResult[0]) {
            throw new Error(`Failed to create form`);
        }

        return { id: insertResult[0].id };
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload);

        const user = await this.getUserById(userId);
        if (!user) throw new Error(`User with id ${userId} does not exist`);

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdBy: formsTable.createdBy,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId));

        return forms;
    }

    public async getFormById(payload: GetFormByIdInputType) {
        const { id } = await getFormByIdInput.parseAsync(payload);

        const rows = await db
            .select({
                form: {
                    id: formsTable.id,
                    title: formsTable.title,
                    description: formsTable.description,
                    createdBy: formsTable.createdBy,
                    createdAt: formsTable.createdAt,
                    updatedAt: formsTable.updatedAt,
                },
                field: formFieldsTable,
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
            .where(eq(formsTable.id, id));

        if (!rows || rows.length === 0 || !rows[0]) {
            throw new Error(`Form with id ${id} does not exist`);
        }

        const form = rows[0].form;
        const fields = rows
            .map((row) => row.field)
            .filter((field): field is NonNullable<typeof field> => field !== null)
            .sort((a, b) => Number(a.index) - Number(b.index));

        return {
            ...form,
            fields,
        };
    }
}

export default FormService;
