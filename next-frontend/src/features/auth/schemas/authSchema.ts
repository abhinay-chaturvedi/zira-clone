import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export const registerSchema = z.object({
  name: z.string().min(1, "Enter your name!"),
  email: z.string().email(),
  password: z.string().min(4, "Minimum of 4 characters required"),
});
export type loginPayload = z.infer<typeof loginSchema>;
export type registerPayload = z.infer<typeof registerSchema>;
