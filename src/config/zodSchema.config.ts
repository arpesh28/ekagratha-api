import mongoose from "mongoose";
import z from "zod";
import { PriorityEnum } from "../typings/enum";

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

export const loginBodySchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string(),
});

export const taskBodySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  priority: z.nativeEnum(PriorityEnum),
  userId: z.custom<mongoose.Types.ObjectId>()
})
export const sendOtpBodySchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email is required" }),
});

export const verifyOtpBodySchema = z.object({
  email: z
    .string()
    .email({ message: "Email must be a valid email address" })
    .min(1, { message: "Email is required" }),
  otp: z.string().length(4, { message: "OTP must be of length 4" }),
});
