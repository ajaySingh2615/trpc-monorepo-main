"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useGetFormById, useSubmitForm } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner"; // Assuming sonner is the toast library in this boilerplate

export default function PublicFormPage() {
  const params = useParams<{ "form-id": string }>();
  const formId = params["form-id"];

  const { form, isLoading, error } = useGetFormById(formId);
  const { submitFormAsync, isLoading: isSubmitting } = useSubmitForm();

  // Store answers in a map of fieldId -> value
  const [answers, setAnswers] = React.useState<Record<string, string | boolean>>({});

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const values = Object.entries(answers).map(([formFieldId, value]) => ({
        formFieldId,
        value: String(value),
      }));

      await submitFormAsync({
        formId,
        values,
      });
      
      toast.success("Form submitted successfully!");
      
      // Reset form
      setAnswers({});
    } catch (err) {
      toast.error("Failed to submit form. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Form Not Found</CardTitle>
            <CardDescription>
              The form you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-muted/30 p-4 pt-12 md:pt-24">
      <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-primary">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {form.title}
          </CardTitle>
          {form.description && (
            <CardDescription className="text-base mt-2 whitespace-pre-wrap">
              {form.description}
            </CardDescription>
          )}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {form.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                This form has no fields yet.
              </div>
            ) : (
              form.fields.map((field) => {
                const value = answers[field.id];

                return (
                  <div key={field.id} className="space-y-3">
                    <Label
                      htmlFor={field.id}
                      className="text-base font-medium flex items-center gap-1"
                    >
                      {field.label}
                      {field.isRequired && (
                        <span className="text-destructive font-bold">*</span>
                      )}
                    </Label>
                    
                    {field.description && (
                      <p className="text-sm text-muted-foreground -mt-2">
                        {field.description}
                      </p>
                    )}

                    {field.type === "TEXT" && (
                      <Input
                        id={field.id}
                        type="text"
                        placeholder={field.placeholder || ""}
                        required={field.isRequired}
                        value={(value as string) || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-11"
                      />
                    )}

                    {field.type === "NUMBER" && (
                      <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder || ""}
                        required={field.isRequired}
                        value={(value as string) || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-11"
                      />
                    )}

                    {field.type === "EMAIL" && (
                      <Input
                        id={field.id}
                        type="email"
                        placeholder={field.placeholder || "example@domain.com"}
                        required={field.isRequired}
                        value={(value as string) || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-11"
                      />
                    )}

                    {field.type === "PASSWORD" && (
                      <Input
                        id={field.id}
                        type="password"
                        placeholder={field.placeholder || "••••••••"}
                        required={field.isRequired}
                        value={(value as string) || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-11"
                      />
                    )}

                    {field.type === "YES_NO" && (
                      <div className="flex items-center space-x-3 h-11 bg-muted/50 px-3 rounded-md border border-input">
                        <Checkbox
                          id={field.id}
                          checked={(value as boolean) || false}
                          onCheckedChange={(checked) =>
                            handleInputChange(field.id, checked === true)
                          }
                          // HTML required attribute works a bit differently on checkboxes,
                          // but passing it down natively to Checkbox (if supported) is best.
                          required={field.isRequired}
                        />
                        <Label
                          htmlFor={field.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {field.placeholder || "Yes / Agree"}
                        </Label>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>

          {form.fields.length > 0 && (
            <CardFooter className="pt-6 border-t bg-muted/20">
              <Button type="submit" size="lg" className="w-full sm:w-auto min-w-32" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
