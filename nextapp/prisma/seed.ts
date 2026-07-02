import bcrypt from "bcryptjs";
import {
  PROJECTS,
  SKILLS,
  EDUCATION,
  CERTIFICATIONS,
  EXPERIENCE,
  OWNER,
  CONTACT_INFO,
  SOCIAL_LINKS,
  BLOGS,
} from "../src/lib/constants";
import prisma from "../src/lib/db";

async function main() {
  console.log("Starting seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "jonsnower07@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-after-first-login";
  
  console.log(`Creating/Updating admin user: ${adminEmail}`);
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("Admin user seeded/updated successfully!");

  // 2. Seed Skills
  console.log("Seeding skills...");
  await prisma.skill.deleteMany();
  for (const skill of SKILLS) {
    await prisma.skill.create({
      data: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon,
        color: skill.color,
        order: skill.order || 0,
      },
    });
  }
  console.log(`Seeded ${SKILLS.length} skills.`);

  // 3. Seed Projects
  console.log("Seeding projects...");
  await prisma.project.deleteMany();
  for (const project of PROJECTS) {
    await prisma.project.create({
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || null,
        tags: project.tags,
        technologies: project.technologies,
        githubUrl: project.githubUrl || null,
        liveUrl: project.liveUrl || null,
        imageUrl: project.imageUrl || null,
        status: project.status,
        featured: project.featured,
        order: project.order,
        type: project.type || null,
      },
    });
  }
  console.log(`Seeded ${PROJECTS.length} projects.`);

  // 4. Seed Education
  console.log("Seeding education...");
  await prisma.education.deleteMany();
  for (const edu of EDUCATION) {
    await prisma.education.create({
      data: {
        id: edu.id,
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location || null,
        startYear: edu.startYear || null,
        endYear: edu.endYear || null,
        grade: edu.grade || null,
        status: edu.status || "completed",
        icon: edu.icon || null,
      },
    });
  }
  console.log(`Seeded ${EDUCATION.length} education entries.`);

  // 5. Seed Certifications
  console.log("Seeding certifications...");
  await prisma.certification.deleteMany();
  for (const cert of CERTIFICATIONS) {
    await prisma.certification.create({
      data: {
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        year: cert.year,
        pdfUrl: cert.pdfUrl || null,
        credentialUrl: cert.credentialUrl || null,
        icon: cert.icon || null,
        color: cert.color || null,
        category: cert.category || null,
      },
    });
  }
  console.log(`Seeded ${CERTIFICATIONS.length} certifications.`);

  // 6. Seed Experience
  console.log("Seeding experience...");
  await prisma.experience.deleteMany();
  for (const exp of EXPERIENCE) {
    await prisma.experience.create({
      data: {
        id: exp.id,
        title: exp.title,
        company: exp.company,
        type: exp.type,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        current: exp.current || false,
        location: exp.location || null,
        description: exp.description || null,
        bullets: exp.bullets,
        technologies: exp.technologies || [],
        icon: exp.icon || null,
      },
    });
  }
  console.log(`Seeded ${EXPERIENCE.length} experience entries.`);

  // 6.5. Clear Blogs (no seeding demo data)
  console.log("Clearing blogs...");
  await prisma.blog.deleteMany();

  // 7. Seed Settings (Site Config)
  console.log("Seeding settings...");
  const settings = [
    { key: "bio", value: OWNER.bio },
    { key: "bio2", value: OWNER.bio2 },
    { key: "title", value: OWNER.title },
    { key: "location", value: OWNER.location },
    { key: "resumeUrl", value: OWNER.resumeUrl },
    { key: "email", value: CONTACT_INFO.email },
    { key: "twitter", value: CONTACT_INFO.twitter || "" },
    { key: "instagram", value: CONTACT_INFO.instagram || "" },
    { key: "linkedin", value: CONTACT_INFO.linkedin || "" },
    { key: "github", value: CONTACT_INFO.github || "" },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log("Seeded settings.");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
