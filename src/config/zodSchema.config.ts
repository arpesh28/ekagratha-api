import z from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(50),
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(16)
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: "Password must contain at least one letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character.",
    }),
});
