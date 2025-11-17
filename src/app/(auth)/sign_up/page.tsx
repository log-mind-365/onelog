"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSignUp } from "@/features/auth/lib/use-sign-up";
import { signUpSchema } from "@/features/auth/model/schemas";
import type { SignUpFormData } from "@/features/auth/model/types";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/model/routes";

const SignUpPage = () => {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      userName: "",
      password: "",
    },
  });

  const handleSubmitSignUp = (data: SignUpFormData) => {
    setIsSubmitting(true);
    signUp(data, {
      onSuccess: () => {
        router.replace(ROUTES.HOME);
      },
      onError: (error) => {
        console.error(error);
        setIsSubmitting(false);
      },
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <main className="flex w-sm flex-col gap-4">
      <form onSubmit={handleSubmit(handleSubmitSignUp)}>
        <FieldSet>
          <FieldLegend className="!text-xl font-semibold">회원가입</FieldLegend>
          <FieldDescription>
            정보를 입력하여 계정을 생성하세요.
          </FieldDescription>
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col gap-2"
                >
                  <FieldLabel htmlFor={field.name}>이메일</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="email"
                    placeholder="example@mail.com"
                    className="bg-card"
                  />
                  <FieldDescription>이메일을 입력하세요.</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="userName"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>닉네임</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="..."
                    className="bg-card"
                  />
                  <FieldDescription>필명을 입력하세요.</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>비밀번호</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="******"
                    className="bg-card"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    6자리 비밀번호를 입력하세요.
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Spinner /> : "회원가입"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
      <div className="flex items-center justify-end">
        <Button
          variant="link"
          size="sm"
          onClick={() => router.push(ROUTES.AUTH.SIGN_IN)}
        >
          로그인하러 가기
        </Button>
      </div>
    </main>
  );
};

export default SignUpPage;
