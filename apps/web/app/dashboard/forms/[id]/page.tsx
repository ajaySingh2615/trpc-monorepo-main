"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { SiteHeader } from "~/components/site-header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetFieldsByFormId, useCreateField, useDeleteField } from "~/hooks/api/form";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

export default function FormBuilderPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch form fields
  const { fields, isLoading: isLoadingFields } = useGetFieldsByFormId(id);

  // Mutations
  const { createFieldAsync, isLoading: isCreating } = useCreateField();
  const { deleteFieldAsync, isLoading: isDeleting } = useDeleteField(id);

  // Dialog State
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("");
  const [isRequired, setIsRequired] = React.useState(false);
  const [type, setType] = React.useState<FieldType>("TEXT");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // Basic fractional index: just appending for now
      const nextIndex =
        fields && fields.length > 0
          ? String(Math.max(...fields.map((f) => Number(f.index) || 0)) + 1)
          : "1";

      await createFieldAsync({
        formId: id,
        label,
        description: description || undefined,
        placeholder: placeholder || undefined,
        isRequired,
        type,
        index: nextIndex,
      });

      // Reset state and close
      setLabel("");
      setDescription("");
      setPlaceholder("");
      setIsRequired(false);
      setType("TEXT");
      setOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to create field.");
      }
    }
  };

  const handleDelete = async (fieldId: string) => {
    if (confirm("Are you sure you want to delete this field?")) {
      await deleteFieldAsync({ id: fieldId });
    }
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <section className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold">Form Builder</h1>
                  <p className="text-sm text-muted-foreground">
                    Editing fields for form <span className="font-mono text-xs">{id}</span>
                  </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Field</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add a new field</DialogTitle>
                      <DialogDescription>
                        Configure the field type, label, and options.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateField} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Field Type</label>
                        <Select value={type} onValueChange={(val: FieldType) => setType(val)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXT">Short Text</SelectItem>
                            <SelectItem value="NUMBER">Number</SelectItem>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="YES_NO">Yes/No</SelectItem>
                            <SelectItem value="PASSWORD">Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Label</label>
                        <Input
                          required
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          placeholder="e.g. Full Name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Help text for the user"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Placeholder (Optional)</label>
                        <Input
                          value={placeholder}
                          onChange={(e) => setPlaceholder(e.target.value)}
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="required"
                          checked={isRequired}
                          onCheckedChange={(checked) => setIsRequired(checked === true)}
                        />
                        <label
                          htmlFor="required"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          This field is required
                        </label>
                      </div>

                      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

                      <DialogFooter className="pt-4">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isCreating}>
                          {isCreating ? "Adding..." : "Add Field"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Fields List */}
              <div className="mt-8">
                {isLoadingFields ? (
                  <p className="text-sm text-muted-foreground">Loading fields...</p>
                ) : fields && fields.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-input p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No fields have been added to this form yet.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Label</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields
                          ?.sort((a, b) => Number(a.index) - Number(b.index))
                          .map((field) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">
                                {field.label}
                                {field.description && (
                                  <span className="block text-xs text-muted-foreground font-normal mt-0.5 truncate max-w-[200px]">
                                    {field.description}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                                  {field.type}
                                </span>
                              </TableCell>
                              <TableCell>{field.isRequired ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                  onClick={() => handleDelete(field.id)}
                                  disabled={isDeleting}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
