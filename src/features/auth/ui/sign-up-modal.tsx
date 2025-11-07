"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useModal } from "@/app/_providers/modal-store";
import { AuthFormField } from "@/entities/user/ui/auth-form-field";
import { useSignUp } from "@/features/auth/lib/use-sign-up";
import { signUpSchema } from "@/features/auth/model/schema";
import type { SignUpFormData } from "@/features/auth/model/types";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";

export const SignUpModal = () => {
  const { openModal } = useModal();
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>회원가입</DialogTitle>
        <DialogDescription>정보를 입력하여 계정을 생성하세요</DialogDescription>
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
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => openModal("sign-in")}
            >
              로그인하러 가기
            </Button>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : "회원가입"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
