"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { SubmitEvent, useState } from "react";
import { flushSync } from "react-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { newProductSchema, NewProductType } from "@/schemas/new-product";

type Field = keyof NewProductType;

const fields: { id: Field; label: string; multiline?: boolean }[] = [
  { id: "name", label: "Product name" },
  { id: "title", label: "Page title" },
  { id: "message", label: "Message", multiline: true },
];

export default function EditProductDialog({
  productId,
  values,
  onSaved,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  productId: string;
  values: NewProductType;
  onSaved: (saved: NewProductType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSaving) onOpenChange(next);
      }}
    >
      <DialogContent finalFocus={returnFocusRef}>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>

          <DialogDescription>
            Changes show on your feedback page right away.
          </DialogDescription>
        </DialogHeader>

        <EditProductForm
          productId={productId}
          values={values}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          onSaved={(saved) => {
            onSaved(saved);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditProductForm({
  productId,
  values,
  isSaving,
  setIsSaving,
  onSaved,
}: {
  productId: string;
  values: NewProductType;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  onSaved: (saved: NewProductType) => void;
}) {
  const [product, setProduct] = useState(values);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = newProductSchema.safeParse(product);

    if (!result.success) {
      const fieldErrors: Partial<Record<Field, string>> = {};

      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as Field] ??= issue.message;
      }

      flushSync(() => setErrors(fieldErrors));

      const firstInvalid = fields.find((field) => fieldErrors[field.id]);
      document.getElementById(`edit-${firstInvalid?.id}`)?.focus();
      return;
    }

    setIsSaving(true);

    try {
      const res = await axios.patch(`/api/product/${productId}`, result.data);

      if (res.data.success) {
        toast.success(res.data.message);
        onSaved(result.data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ??
            "Could not save the product. Try again."
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-5">
        {fields.map((field) => {
          const id = `edit-${field.id}`;
          const error = errors[field.id];

          const inputProps = {
            id,
            value: product[field.id],
            onChange: (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setProduct((current) => ({
                ...current,
                [field.id]: e.target.value,
              }));
              setErrors((current) => ({ ...current, [field.id]: undefined }));
            },
            "aria-required": true,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
            className: "mt-2 aria-invalid:border-red-500",
          };

          return (
            <div key={field.id}>
              <Label htmlFor={id}>{field.label}</Label>

              {field.multiline ? (
                <Textarea
                  {...inputProps}
                  rows={3}
                  className={`${inputProps.className} resize-none`}
                />
              ) : (
                <Input {...inputProps} />
              )}

              {error && (
                <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <DialogFooter className="mt-8">
        <DialogClose
          disabled={isSaving}
          render={<Button type="button" variant="outline" />}
        >
          Cancel
        </DialogClose>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
