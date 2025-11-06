import type {
  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  FieldError as Error,
  UseFormRegisterReturn,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

type AuthFormFieldProps = {
  register: UseFormRegisterReturn;
  error?: Error;
  type?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
};

export const AuthFormField = ({
  placeholder,
  type,
  name,
  register,
  required = false,
  error,
  description,
}: AuthFormFieldProps) => {
  return (
    <Field className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor={type}>{name}</FieldLabel>
      <Input
        id={type}
        placeholder={placeholder}
        type={type}
        required={required}
        {...register}
        className="bg-card"
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{error?.message}</FieldError>
    </Field>
  );
};
