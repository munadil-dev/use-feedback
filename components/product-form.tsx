"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { SubmitEvent, useState } from "react";
import { flushSync } from "react-dom";
import { useAtom, useSetAtom } from "jotai";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { newProductAtom } from "@/store/atoms/new-product";
import { productCreatedAtom } from "@/store/atoms/product-created";
import { newProductSchema } from "@/schemas/new-product";

type Field = "name" | "title" | "message";
type FieldErrors = Partial<Record<Field, string>>;

const fields: {
  id: Field;
  label: string;
  hint: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    id: "name",
    label: "Product name",
    hint: "Only you see this, on your dashboard.",
    placeholder: "Acme",
  },
  {
    id: "title",
    label: "Page title",
    hint: "The heading customers see when they open your link.",
    placeholder: "How are you finding Acme?",
  },
  {
    id: "message",
    label: "Message",
    hint: "A short note asking for feedback.",
    placeholder: "We read every reply. Tell us what you love and what to fix.",
    multiline: true,
  },
];

export default function ProductForm() {
  const [newProduct, setNewProduct] = useAtom(newProductAtom);
  const setIsProductCreated = useSetAtom(productCreatedAtom);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: Field, value: string) => {
    setNewProduct((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = newProductSchema.safeParse(newProduct);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as Field] ??= issue.message;
      }

      flushSync(() => setErrors(fieldErrors));

      const firstInvalid = fields.find((field) => fieldErrors[field.id]);
      document.getElementById(firstInvalid?.id ?? "")?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/product/create-product", result.data);

      if (res.data.success) {
        toast.success(res.data.message);
        setIsProductCreated(true);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-10" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-7">
        {fields.map((field) => {
          const error = errors[field.id];

          const inputProps = {
            id: field.id,
            placeholder: field.placeholder,
            value: newProduct[field.id],
            onChange: (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => handleChange(field.id, e.target.value),
            "aria-required": true,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": `${field.id}-hint`,
            className: "mt-2 bg-white aria-invalid:border-red-500",
          };

          return (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>

              {field.multiline ? (
                <Textarea
                  {...inputProps}
                  rows={3}
                  className={`${inputProps.className} resize-none`}
                />
              ) : (
                <Input {...inputProps} />
              )}

              <p
                id={`${field.id}-hint`}
                className={`mt-2 text-sm ${error ? "text-red-600" : "text-zinc-500"}`}
              >
                {error ?? field.hint}
              </p>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-10 h-11 w-full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create product"}
      </Button>
    </form>
  );
}
