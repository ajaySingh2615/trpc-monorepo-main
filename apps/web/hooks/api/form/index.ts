import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.listForms.invalidate();
        }
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isLoading: status === "pending",
        isSuccess,
        status,
    };
};

export const useListForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } = trpc.form.listForms.useQuery();
    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useGetFieldsByFormId = (formId: string) => {
    const { data: fields, error, isFetched, isFetching, isLoading, status } = trpc.form.getFieldsByFormId.useQuery({ formId }, {
        enabled: !!formId,
    });
    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useCreateField = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createField.useMutation({
        onSuccess: async (_, variables) => {
            await utils.form.getFieldsByFormId.invalidate({ formId: variables.formId });
        }
    });

    return {
        createFieldAsync,
        createField,
        error,
        isError,
        isIdle,
        isLoading: status === "pending",
        isSuccess,
        status,
    };
};

export const useUpdateField = (formId?: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.updateField.useMutation({
        onSuccess: async () => {
            if (formId) {
                await utils.form.getFieldsByFormId.invalidate({ formId });
            } else {
                await utils.form.getFieldsByFormId.invalidate();
            }
        }
    });

    return {
        updateFieldAsync,
        updateField,
        error,
        isError,
        isIdle,
        isLoading: status === "pending",
        isSuccess,
        status,
    };
};

export const useDeleteField = (formId?: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.deleteField.useMutation({
        onSuccess: async () => {
            if (formId) {
                await utils.form.getFieldsByFormId.invalidate({ formId });
            } else {
                await utils.form.getFieldsByFormId.invalidate();
            }
        }
    });

    return {
        deleteFieldAsync,
        deleteField,
        error,
        isError,
        isIdle,
        isLoading: status === "pending",
        isSuccess,
        status,
    };
};

export const useGetFormById = (formId: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status } = trpc.form.getFormById.useQuery({ id: formId }, {
        enabled: !!formId,
    });
    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useSubmitForm = () => {
    const {
        mutateAsync: submitFormAsync,
        mutate: submitForm,
        error,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.submitForm.useMutation();

    return {
        submitFormAsync,
        submitForm,
        error,
        isError,
        isIdle,
        isLoading: status === "pending",
        isSuccess,
        status,
    };
};

export const useGetSubmissionsByFormId = (formId: string) => {
    const { data: submissions, error, isFetched, isFetching, isLoading, status } = trpc.form.getSubmissionsByFormId.useQuery({ formId }, {
        enabled: !!formId,
    });
    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};
