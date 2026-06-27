import { z } from "zod";

// ── Contact Form ───────────────────────────────────────────
export const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+\d\s\-\(\)]{7,20}$/.test(val),
      "Please enter a valid phone number"
    ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

// ── Authentication ─────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().min(3, "Please enter a valid email or username"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

// ── Project (Admin) ────────────────────────────────────────
export const ProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  longDescription: z.string().max(5000).optional(),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  technologies: z.array(z.string()),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  status: z.enum(["completed", "in_progress", "held", "archived"]),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  type: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;

// ── Skill (Admin) ──────────────────────────────────────────
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  category: z.enum(["languages", "databases", "security", "tools", "frameworks"]),
  proficiency: z.number().int().min(0).max(100),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export type SkillFormValues = z.infer<typeof SkillSchema>;

// ── Experience (Admin) ─────────────────────────────────────
export const ExperienceSchema = z.object({
  title: z.string().min(3).max(200),
  company: z.string().min(2).max(200),
  type: z.enum(["internship", "freelance", "full_time", "part_time"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .optional(),
  current: z.boolean().default(false),
  description: z.string().max(1000).optional(),
  bullets: z.array(z.string().min(10)).min(1, "Add at least one bullet point"),
  technologies: z.array(z.string()).optional(),
});

export type ExperienceFormValues = z.infer<typeof ExperienceSchema>;

// ── Education (Admin) ──────────────────────────────────────
export const EducationSchema = z.object({
  degree: z.string().min(5).max(300),
  institution: z.string().min(3).max(300),
  location: z.string().max(200).optional(),
  startYear: z.number().int().min(1990).max(2050).optional(),
  endYear: z.number().int().min(1990).max(2050).optional(),
  grade: z.string().max(50).optional(),
  status: z.enum(["current", "completed"]).default("completed"),
});

export type EducationFormValues = z.infer<typeof EducationSchema>;

// ── Certification (Admin) ──────────────────────────────────
export const CertificationSchema = z.object({
  name: z.string().min(3).max(300),
  issuer: z.string().min(2).max(200),
  year: z.number().int().min(2000).max(2100),
  pdfUrl: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional(),
  color: z.string().optional(),
  category: z.string().max(100).optional(),
});

export type CertificationFormValues = z.infer<typeof CertificationSchema>;

// ── Settings (Admin) ───────────────────────────────────────
export const SettingsSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500),
  bio2: z.string().max(500).optional(),
  email: z.string().email(),
  githubUsername: z.string().min(1).max(100),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
  instagramHandle: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof SettingsSchema>;

// ── API Query Params ───────────────────────────────────────
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;
