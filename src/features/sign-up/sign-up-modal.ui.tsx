"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { AuthFormField } from "@/entities/auth/ui/auth-form-field";
import {
  type SignUpFormData,
  signUpSchema,
} from "@/features/sign-up/sign-up.model";
import { useSignUp } from "@/features/sign-up/sign-up.mutation";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

type SignUpModalProps = PropsWithChildren &
  DialogProps & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSwitchToSignIn?: () => void;
  };

export const SignUpModal = ({
  children,
  open,
  onOpenChange,
  onSwitchToSignIn,
}: SignUpModalProps) => {
  const { mutate: signUp, isPending } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleSubmitSignUp = (data: SignUpFormData) => {
    signUp({
      email: data.email,
      userName: data.userName,
      password: data.password,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
          <DialogDescription>
            정보를 입력하여 계정을 생성하세요
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSubmitSignUp)}
          className="w-full space-y-4"
        >
          <AuthFormField
            register={register("email")}
            error={errors.email}
            type="email"
            name="이메일"
          />
          <AuthFormField
            register={register("userName")}
            error={errors.userName}
            type="text"
            name="필명"
          />
          <AuthFormField
            register={register("password")}
            error={errors.password}
            type="password"
            name="비밀번호"
          />
          <AuthFormField
            register={register("passwordConfirmation")}
            error={errors.passwordConfirmation}
            type="password"
            name="비밀번호 확인"
          />
          <DialogFooter className="sm:flex-col">
            {onSwitchToSignIn && (
              <div className="flex items-center justify-end">
                <Button variant="link" size="sm" onClick={onSwitchToSignIn}>
                  로그인하러 가기
                </Button>
              </div>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Spinner /> : "회원가입"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
