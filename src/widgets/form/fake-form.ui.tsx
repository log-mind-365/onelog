"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthGuard } from "@/features/auth-guard/auth-guard.model";
import { AuthGuardModal } from "@/features/auth-guard/auth-guard-modal.ui";
import { SignInModal } from "@/features/sign-in/sign-in-modal.ui";
import { SignUpModal } from "@/features/sign-up/sign-up-modal.ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/routes";
import { useMe } from "@/shared/store/use-me";

export const FakeForm = () => {
  const router = useRouter();
  const { me } = useMe();
  const { authGuard, showAuthGuard, setShowAuthGuard } = useAuthGuard();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handlePostClick = () => {
    authGuard(() => router.push(ROUTES.ARTICLE.NEW));
  };

  const handleSignInClick = () => {
    setShowAuthGuard(false);
    setShowSignIn(true);
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  return (
    <>
      <Card
        className="flex cursor-pointer gap-4 border-0 p-4"
        onClick={handlePostClick}
      >
        <Avatar className="hidden size-10 sm:flex">
          <AvatarImage src={me?.avatarUrl || undefined} />
          <AvatarFallback>
            {me?.userName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 items-center rounded-md bg-muted/50 p-3 text-muted-foreground text-sm">
          오늘 당신의 생각을 한 줄로 기록하세요.
        </div>
      </Card>

      {/* Auth Dialogs */}
      <AuthGuardModal
        open={showAuthGuard}
        onOpenChange={setShowAuthGuard}
        onSignInClick={handleSignInClick}
      />
      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </>
  );
};
