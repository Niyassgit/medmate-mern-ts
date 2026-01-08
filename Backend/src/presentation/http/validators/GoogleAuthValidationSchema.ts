import { z } from "zod";

export const validateGooglePrecheck = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export const validateGoogleLogin = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
  role: z.string().optional(),
});

export type GooglePrecheckRequestBody = z.infer<typeof validateGooglePrecheck>;
export type GoogleLoginRequestBody = z.infer<typeof validateGoogleLogin>;

