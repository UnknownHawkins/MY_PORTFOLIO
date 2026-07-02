// ============================================================
// Global TypeScript Types — Portfolio Platform
// ============================================================

export type ProjectStatus = "completed" | "in_progress" | "held" | "archived";
export type SkillCategory =
  | "languages"
  | "databases"
  | "security"
  | "tools"
  | "frameworks";
export type ExperienceType = "internship" | "freelance" | "full_time" | "part_time";
export type UserRole = "admin" | "viewer";

// ── Portfolio Data Types ──────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  tags: string[];
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  type?: string | null; // e.g. "Hackathon", "Class Project", "Mini Project"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0-100
  icon?: string;
  color?: string;
  order?: number;
}

export interface SkillCategory_Group {
  id: SkillCategory;
  label: string;
  icon: string;
  color: string;
  skills: Skill[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  grade?: string | null;
  status?: string | null;
  icon?: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  pdfUrl?: string | null;
  credentialUrl?: string | null;
  icon?: string | null;
  color?: string | null;
  category?: string | null;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  location?: string | null;
  description?: string | null;
  bullets: string[];
  technologies?: string[] | null;
  icon?: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface ContactInfo {
  email: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

// ── GitHub Types ──────────────────────────────────────────

export interface GitHubUser {
  login: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  location?: string;
  blog?: string;
  company?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  htmlUrl: string;
  homepage?: string;
  language?: string;
  stargazersCount: number;
  forksCount: number;
  watchersCount: number;
  openIssuesCount: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isPrivate: boolean;
  isFork: boolean;
  defaultBranch: string;
}

export interface GitHubStats {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  topLanguages: Record<string, number>;
  contributionsLastYear?: number;
  currentStreak?: number;
  longestStreak?: number;
  pinnedRepos?: GitHubRepo[];
  recentActivity?: GitHubRepo[];
  contributionGraph?: ContributionGraph;
  fetchedAt?: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionGraph {
  weeks: ContributionWeek[];
  totalContributions: number;
}

// ── Contact Types ─────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  id: string;
  read: boolean;
  createdAt: Date;
  ipAddress?: string;
}

// ── API Types ─────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── Admin Types ───────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalPageViews: number;
  totalVisitors: number;
  githubStars: number;
}

export interface AnalyticsEvent {
  id: string;
  page: string;
  event: string;
  userAgent?: string;
  country?: string;
  createdAt: Date;
}

// ── UI Types ──────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  id: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

export interface ThemeType {
  mode: "dark" | "light" | "system";
}

export interface Blog {
  id: string;
  title: string;
  partNo: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

