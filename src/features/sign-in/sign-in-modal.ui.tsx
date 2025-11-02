"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { AuthFormField } from "@/entities/auth/ui/auth-form-field";
import {
  type SignInFormData,
  signInSchema,
} from "@/features/sign-in/sign-in.model";
import { useSignIn } from "@/features/sign-in/sign-in.mutation";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

type SignInModalProps = PropsWithChildren &
  DialogProps & {
    onSwitchToSignUp?: () => void;
  };

export const SignInModal = ({
  children,
  open,
  onOpenChange,
  onSwitchToSignUp,
}: SignInModalProps) => {
  const { mutate: signIn, isPending } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitSignIn = (data: SignInFormData) => {
    signIn(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            이메일과 비밀번호를 입력하여 로그인하세요
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSubmitSignIn)}
          className="w-full space-y-4"
        >
          <AuthFormField
            register={register("email")}
            error={errors.email}
            type="email"
            name="이메일"
          />
          <AuthFormField
            register={register("password")}
            error={errors.password}
            type="password"
            name="비밀번호"
          />
          {onSwitchToSignUp && (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0"
                onClick={onSwitchToSignUp}
              >
                가입하러 가기
              </Button>
            </div>
          )}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : "로그인"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
