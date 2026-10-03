import { z } from "zod";

export const CATEGORIES: readonly string[] = [
  "Water Supply",
  "Roads",
  "Garbage",
  "Drainage",
  "Sewerage",
  "Streetlights",
  "Parks",
  "Pollution",
  "Illegal Dumping",
  "Public Toilets",
  "Stray Animals",
  "Other",
] as const;

export const DEPARTMENTS: readonly string[] = [
  "water",
  "roads",
  "sanitation",
  "sewerage",
  "lighting",
  "parks",
  "environment",
  "animals",
  "general",
] as const;

export const STATUSES: readonly string[] = [
  "SUBMITTED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REOPENED",
  "REJECTED",
  "DUPLICATE",
] as const;

export const PRIORITIES: readonly string[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export const CATEGORY_TO_DEPARTMENT: Record<string, string> = {
  "Water Supply": "water",
  Roads: "roads",
  Garbage: "sanitation",
  Drainage: "sewerage",
  Sewerage: "sewerage",
  Streetlights: "lighting",
  Parks: "parks",
  Pollution: "environment",
  "Illegal Dumping": "sanitation",
  "Public Toilets": "sanitation",
  "Stray Animals": "animals",
  Other: "general",
};

export const STATUS_FLOW: Record<string, string[]> = {
  SUBMITTED: ["VERIFIED", "REJECTED", "DUPLICATE"],
  VERIFIED: ["ASSIGNED", "REJECTED", "DUPLICATE"],
  ASSIGNED: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: ["REOPENED"],
  REOPENED: ["IN_PROGRESS"],
  REJECTED: [],
  DUPLICATE: [],
};

export const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  VERIFIED: "Verified",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REOPENED: "Reopened",
  REJECTED: "Rejected",
  DUPLICATE: "Duplicate",
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().trim().min(3).max(200),
});

const imageSchema = z.object({
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  uploadedAt: z.string().optional(),
});

export const createComplaintSchema = z.object({
  category: z.string().min(1).refine((v) => CATEGORIES.includes(v as any), {
    message: "Invalid category",
  }),
  subCategory: z.string().max(120).optional(),
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(10).max(2000),
  images: z.array(imageSchema).max(5).optional().default([]),
  location: latLngSchema,
  area: z.string().trim().min(2).max(120),
  ward: z.string().trim().min(2).max(60),
  anonymous: z.boolean().default(false),
  citizenId: z.string().optional(),
  citizenName: z.string().trim().max(120).optional(),
  citizenPhone: z.string().trim().max(20).optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;

export const updateStatusSchema = z.object({
  status: z.string().refine((v) => STATUSES.includes(v as any), {
    message: "Invalid status",
  }),
  note: z.string().trim().max(1000).optional(),
});

export const updateComplaintSchema = z.object({
  priority: z.string().refine((v) => PRIORITIES.includes(v as any)).optional(),
  assignedTo: z.string().optional(),
  resolutionNote: z.string().trim().max(2000).optional(),
  resolutionImages: z.array(imageSchema).max(5).optional(),
});

export const addUpdateSchema = z.object({
  type: z.enum([
    "STATUS_CHANGE",
    "NOTE",
    "ASSIGNMENT",
    "RESOLUTION",
    "REOPEN",
  ]),
  body: z.string().trim().min(1).max(1500),
  images: z.array(imageSchema).max(5).optional().default([]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6).max(200),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email("Invalid email"),
  password: z.string().min(8).max(200),
  phone: z.string().trim().max(20).optional(),
});

export const areaSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  pincode: z.string().trim().max(10).optional(),
  ward: z.string().trim().max(60).optional(),
});

export const complaintQuerySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  area: z.string().optional(),
  ward: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  q: z.string().trim().max(160).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  sort: z
    .enum(["newest", "oldest", "priority"])
    .default("newest"),
});

export type ComplaintQuery = z.infer<typeof complaintQuerySchema>;