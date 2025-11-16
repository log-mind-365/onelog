import type { z } from "zod";
import type { signInSchema, signUpSchema } from "@/features/auth/model/schemas";

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
