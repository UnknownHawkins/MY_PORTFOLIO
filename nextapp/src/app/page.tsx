import React from "react";
import prisma from "@/lib/db";
import type { Skill, Project, Experience as ExperienceModel, Education as EducationModel, Certification } from "@/types";

// Layout & Shared components
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import LoadingScreen from "@/components/shared/LoadingScreen";

// Sections
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import GitHub from "@/components/sections/GitHub";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

// Page cache revalidation limit: 1 hour
export const revalidate = 3600;

export default async function HomePage() {
  let skills: Skill[] | undefined = undefined;
  let projects: Project[] | undefined = undefined;
  let experience: ExperienceModel[] | undefined = undefined;
  let education: EducationModel[] | undefined = undefined;
  let certifications: Certification[] | undefined = undefined;

  // Retrieve data from DB if configured
  if (process.env.DATABASE_URL) {
    try {
      const [
        dbSkills,
        dbProjects,
        dbExperience,
        dbEducation,
        dbCertifications,
      ] = await Promise.all([
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({ orderBy: { order: "asc" } }),
        prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
        prisma.education.findMany({ orderBy: { endYear: "desc" } }),
        prisma.certification.findMany({ orderBy: { year: "desc" } }),
      ]);

      if (dbSkills.length > 0) skills = dbSkills as unknown as Skill[];
      if (dbProjects.length > 0) projects = dbProjects as unknown as Project[];
      if (dbExperience.length > 0) experience = dbExperience as unknown as ExperienceModel[];
      if (dbEducation.length > 0) education = dbEducation as unknown as EducationModel[];
      if (dbCertifications.length > 0) certifications = dbCertifications as unknown as Certification[];
      
      console.log("Successfully fetched homepage data from database.");
    } catch (err) {
      console.error(
        "Database is configured but query failed, falling back to static constants:",
        err
      );
    }
  } else {
    console.log("Database not configured. Using static constants on homepage.");
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <MobileMenu />
      
      <main className="flex-grow">
        <Hero />
        <Skills initialSkills={skills} />
        <Education initialEducation={education} />
        <Certifications initialCertifications={certifications} />
        <Projects initialProjects={projects} />
        <GitHub />
        <Experience initialExperience={experience} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
