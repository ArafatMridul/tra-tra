import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Please provide your full name"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  fullName: z.string().min(2),
  bio: z.string().max(500).optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const journalEntrySchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  visitedDate: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  companions: z.string().optional(),
  rating: z.string().optional(),
});
