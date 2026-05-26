"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { SiteHeader } from "~/components/site-header";
import { useCreateForm, useListForms } from "~/hooks/api/form";

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const { createFormAsync, error, isLoading, isSuccess } = useCreateForm();
  const { forms, isLoading: isLoadingForms } = useListForms();

  const errorMessage = error instanceof Error ? error.message : undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createFormAsync({ title, description });
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <section className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Forms</h1>
                  <p className="text-sm text-muted-foreground">
                    Create new forms and manage your dashboard content.
                  </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>Create form</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new form</DialogTitle>
                      <DialogDescription>
                        Enter the form title and description to create a new form.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="form-title" className="text-sm font-medium leading-none">
                            Form title
                          </label>
                          <Input
                            id="form-title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Acme project"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="form-description"
                            className="text-sm font-medium leading-none"
                          >
                            Description
                          </label>
                          <Textarea
                            id="form-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Add a short description"
                            rows={6}
                          />
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                          {errorMessage}
                        </div>
                      )}

                      {isSuccess && (
                        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
                          Form created successfully.
                        </div>
                      )}

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creating..." : "Create form"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingForms && (
                <p className="text-sm text-muted-foreground">Loading forms...</p>
              )}

              {forms && forms.length === 0 && (
                <div className="rounded-2xl border border-dashed border-input p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No forms yet. Create your first form to get started.
                  </p>
                </div>
              )}

              {forms && forms.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead>Updated at</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {form.description || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {form.createdAt
                            ? new Date(form.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {form.updatedAt
                            ? new Date(form.updatedAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/forms/${form.id}`}>Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
