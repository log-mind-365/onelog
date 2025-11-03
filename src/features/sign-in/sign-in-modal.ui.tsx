"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthFormField } from "@/entities/auth/ui/auth-form-field";
import {
  type SignInFormData,
  signInSchema,
} from "@/features/sign-in/sign-in.model";
import { useSignIn } from "@/features/sign-in/sign-in.mutation";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Spinner } from "@/shared/components/ui/spinner";
import { useModal } from "@/shared/store/use-modal";

export const SignInModal = () => {
  const { mutate: signIn, isPending } = useSignIn();
  const { openModal } = useModal();
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
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0"
            onClick={() => openModal("sign-up")}
          >
            가입하러 가기
          </Button>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "로그인"}
        </Button>
      </form>
    </DialogContent>
  );
};
