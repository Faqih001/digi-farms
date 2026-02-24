import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["FARMER", "SUPPLIER", "LENDER"]),
    country: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const farmSchema = z.object({
  name: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().min(3, "Location is required"),
  sizeHectares: z.number().positive("Size must be a positive number"),
  soilType: z.string().optional(),
  waterSource: z.string().optional(),
  description: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const loanApplicationSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  purpose: z.string().min(10, "Please describe the loan purpose"),
  tenure: z.number().int().min(1).max(60, "Tenure must be between 1 and 60 months"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum(["general", "partnership", "investor", "support", "media"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type FarmInput = z.infer<typeof farmSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
