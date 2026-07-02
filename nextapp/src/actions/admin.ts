"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import {
  ProjectSchema,
  SkillSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  SettingsSchema,
  BlogSchema,
} from "@/lib/validations";

/**
 * Helper to assert user is authenticated as admin
 */
async function assertAdmin() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
  return session;
}

// ── PROJECT CRUD ──────────────────────────────────────────

export async function createProject(formData: any) {
  await assertAdmin();
  const parsed = ProjectSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid project data");
  }

  const project = await prisma.project.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true, data: project };
}

export async function updateProject(id: string, formData: any) {
  await assertAdmin();
  const parsed = ProjectSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid project data");
  }

  const project = await prisma.project.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  return { success: true, data: project };
}

export async function deleteProject(id: string) {
  await assertAdmin();
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

// ── SKILL CRUD ─────────────────────────────────────────────

export async function upsertSkill(id: string | null, formData: any) {
  await assertAdmin();
  const parsed = SkillSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid skill data");
  }

  let skill;
  if (id) {
    skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
    });
  } else {
    skill = await prisma.skill.create({
      data: parsed.data,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true, data: skill };
}

export async function deleteSkill(id: string) {
  await assertAdmin();
  await prisma.skill.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

// ── EXPERIENCE CRUD ────────────────────────────────────────

export async function createExperience(formData: any) {
  await assertAdmin();
  const parsed = ExperienceSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid experience data");
  }

  const exp = await prisma.experience.create({
    data: {
      ...parsed.data,
      technologies: parsed.data.technologies || [],
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, data: exp };
}

export async function updateExperience(id: string, formData: any) {
  await assertAdmin();
  const parsed = ExperienceSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid experience data");
  }

  const exp = await prisma.experience.update({
    where: { id },
    data: {
      ...parsed.data,
      technologies: parsed.data.technologies || [],
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true, data: exp };
}

export async function deleteExperience(id: string) {
  await assertAdmin();
  await prisma.experience.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}

// ── EDUCATION CRUD ─────────────────────────────────────────

export async function createEducation(formData: any) {
  await assertAdmin();
  const parsed = EducationSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid education data");
  }

  const edu = await prisma.education.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true, data: edu };
}

export async function updateEducation(id: string, formData: any) {
  await assertAdmin();
  const parsed = EducationSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid education data");
  }

  const edu = await prisma.education.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true, data: edu };
}

export async function deleteEducation(id: string) {
  await assertAdmin();
  await prisma.education.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true };
}

// ── CERTIFICATION CRUD ─────────────────────────────────────

export async function createCertification(formData: any) {
  await assertAdmin();
  const parsed = CertificationSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid certification data");
  }

  const cert = await prisma.certification.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, data: cert };
}

export async function updateCertification(id: string, formData: any) {
  await assertAdmin();
  const parsed = CertificationSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid certification data");
  }

  const cert = await prisma.certification.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true, data: cert };
}

export async function deleteCertification(id: string) {
  await assertAdmin();
  await prisma.certification.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/certifications");
  return { success: true };
}

// ── MESSAGES HANDLERS ──────────────────────────────────────

export async function toggleMessageRead(id: string, read: boolean) {
  await assertAdmin();
  const msg = await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true, data: msg };
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

// ── SITE SETTINGS ──────────────────────────────────────────

export async function updateSettings(formData: any) {
  await assertAdmin();
  const parsed = SettingsSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid settings data");
  }

  const updates = Object.entries(parsed.data).map(([key, value]) => {
    return prisma.settings.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    });
  });

  await prisma.$transaction(updates);

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

// ── BLOG CRUD ─────────────────────────────────────────────

export async function createBlog(formData: any) {
  await assertAdmin();
  const parsed = BlogSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid blog data");
  }

  const blog = await prisma.blog.create({
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/letsfuck/blogs");
  return { success: true, data: blog };
}

export async function updateBlog(id: string, formData: any) {
  await assertAdmin();
  const parsed = BlogSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid blog data");
  }

  const blog = await prisma.blog.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/letsfuck/blogs");
  return { success: true, data: blog };
}

export async function deleteBlog(id: string) {
  await assertAdmin();
  await prisma.blog.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/letsfuck/blogs");
  return { success: true };
}
