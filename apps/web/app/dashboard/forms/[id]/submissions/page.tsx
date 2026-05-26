"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { SiteHeader } from "~/components/site-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetFieldsByFormId, useGetSubmissionsByFormId } from "~/hooks/api/form";

export default function FormSubmissionsPage() {
  const { id } = useParams<{ id: string }>();

  const { fields, isLoading: isLoadingFields } = useGetFieldsByFormId(id);
  const { submissions, isLoading: isLoadingSubmissions } = useGetSubmissionsByFormId(id);

  const isLoading = isLoadingFields || isLoadingSubmissions;

  // Sort fields by index for consistent column ordering
  const sortedFields = React.useMemo(() => {
    if (!fields) return [];
    return [...fields].sort((a, b) => Number(a.index) - Number(b.index));
  }, [fields]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <section className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold">Form Submissions</h1>
                  <p className="text-sm text-muted-foreground">
                    Viewing submissions for form <span className="font-mono text-xs">{id}</span>
                  </p>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="mt-8">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading submissions...</p>
                ) : !submissions || submissions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-input p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No submissions have been received for this form yet.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Submitted At</TableHead>
                          {sortedFields.map((field) => (
                            <TableHead key={field.id} className="whitespace-nowrap">
                              {field.label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => {
                          // Handle cases where values might come back as a JSON string
                          let parsedValues: { formFieldId: string; value: string }[] = [];
                          if (Array.isArray(submission.values)) {
                            parsedValues = submission.values;
                          } else if (typeof submission.values === "string") {
                            try {
                              parsedValues = JSON.parse(submission.values);
                            } catch (e) {
                              console.error("Failed to parse submission values", e);
                            }
                          }

                          return (
                            <TableRow key={submission.id}>
                              <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                                {submission.createdAt
                                  ? new Date(submission.createdAt).toLocaleString()
                                  : "Unknown"}
                              </TableCell>
                              {sortedFields.map((field) => {
                                const fieldValue = parsedValues.find(
                                  (v) => v.formFieldId === field.id
                                )?.value;

                                return (
                                  <TableCell key={field.id} className="whitespace-nowrap">
                                    {fieldValue || "-"}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
