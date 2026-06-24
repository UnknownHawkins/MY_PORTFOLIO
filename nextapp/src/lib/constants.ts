// ============================================================
// Static Fallback Data — All Existing Portfolio Content
// This is the single source of truth when database is unavailable
// ============================================================

import type {
  Project,
  Skill,
  Education,
  Certification,
  Experience,
  SocialLink,
  ContactInfo,
  NavLink,
  GitHubRepo,
} from "@/types";

// ── Identity ──────────────────────────────────────────────
export const OWNER = {
  name: "Anubhav Singh",
  username: "UnknownHawkins",
  title: "Pre Final-Year Eng Student",
  roles: [
    "CS Engineering Student",
    "Python Developer",
    "Cybersecurity Enthusiast",
    "Web Developer",
    "Open Source Contributor",
  ],
  bio: "I didn't know anything about tech when I was in school, but once I got to college and started learning about it, my interest grew bigger and bigger. What started as curiosity soon turned into a real passion for building practical projects and exploring cybersecurity to help protect people online.",
  bio2: "Outside of coding, I enjoy playing games, watching anime and movies of all genres, and spending peaceful mornings and evenings in my hometown, surrounded by animals and nature.",
  avatarUrl: "/assets/letter-a.png",
  logoUrl: "/assets/logo.png",
  resumeUrl: "/assets/Anubhav_Singh_Resume.pdf",
  location: "GLA University, Mathura, India",
  university: "GLA University, Mathura",
  degree: "B.Tech in Computer Science and Engineering",
  expectedGraduation: "2027",
};

// ── Contact Information ────────────────────────────────────
export const CONTACT_INFO: ContactInfo = {
  email: "jonsnower07@gmail.com",
  twitter: "https://x.com/fav7659",
  instagram: "https://www.instagram.com/scared__abhiii?igsh=MTg3a3g1aHdyZXhybQ==",
  linkedin: "https://www.linkedin.com/in/anubhav-singh-aa800b307",
  github: "https://github.com/UnknownHawkins/",
};

// ── Social Links ───────────────────────────────────────────
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/anubhav-singh-aa800b307",
    icon: "linkedin",
    label: "Connect on LinkedIn",
  },
  {
    platform: "GitHub",
    url: "https://github.com/UnknownHawkins/",
    icon: "github",
    label: "Follow on GitHub",
  },
  {
    platform: "Twitter",
    url: "https://x.com/fav7659",
    icon: "twitter",
    label: "@fav7659 on X",
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/scared__abhiii?igsh=MTg3a3g1aHdyZXhybQ==",
    icon: "instagram",
    label: "@scared__abhiii",
  },
];

// ── Navigation Links ───────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "GitHub", href: "#github", id: "github" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

// ── Skills ─────────────────────────────────────────────────
export const SKILLS: Skill[] = [
  // Programming Languages
  { id: "python", name: "Python", category: "languages", proficiency: 80, icon: "fab fa-python", color: "#3776AB" },
  { id: "c", name: "C Programming", category: "languages", proficiency: 50, icon: "fas fa-code", color: "#555" },
  { id: "java", name: "Java", category: "languages", proficiency: 60, icon: "fab fa-java", color: "#ED8B00" },
  { id: "html-css", name: "HTML/CSS", category: "languages", proficiency: 80, icon: "fab fa-html5", color: "#E34F26" },
  // Databases
  { id: "mysql", name: "MySQL", category: "databases", proficiency: 88, icon: "fas fa-database", color: "#4479A1" },
  { id: "oracle", name: "Oracle", category: "databases", proficiency: 75, icon: "fas fa-database", color: "#F80000" },
  // Security & OS
  { id: "kali", name: "Kali Linux", category: "security", proficiency: 82, icon: "fab fa-linux", color: "#4CAF50" },
  { id: "linux", name: "Linux", category: "security", proficiency: 85, icon: "fab fa-linux", color: "#FCC624" },
  { id: "cybersecurity", name: "Cybersecurity", category: "security", proficiency: 78, icon: "fas fa-shield-alt", color: "#10b981" },
  // Tools & Soft Skills
  { id: "git", name: "Git", category: "tools", proficiency: 90, icon: "fab fa-git-alt", color: "#F05032" },
  { id: "n8n", name: "n8n", category: "tools", proficiency: 75, icon: "fas fa-project-diagram", color: "#EA4B71" },
  { id: "firebase", name: "Firebase", category: "tools", proficiency: 85, icon: "fas fa-fire", color: "#FFCA28" },
  { id: "communication", name: "Communication", category: "tools", proficiency: 92, icon: "fas fa-comments", color: "#06b6d4" },
];

// ── Education ──────────────────────────────────────────────
export const EDUCATION: Education[] = [
  {
    id: "btech",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "GLA University, Mathura",
    location: "Mathura, Uttar Pradesh",
    endYear: 2027,
    status: "current",
    icon: "graduation-cap",
    grade: "Third Year Student",
  },
  {
    id: "intermediate",
    degree: "Intermediate Degree (12th Grade)",
    institution: "Janta Vidhyalaya Inter Collage, Bakewar, Etawah",
    endYear: 2021,
    status: "completed",
    icon: "school",
    grade: "B",
  },
  {
    id: "highschool",
    degree: "High School (10th Grade)",
    institution: "Saraswati Vidhya Mandir, Dibiyapur, Auraiya",
    endYear: 2023,
    status: "completed",
    icon: "book",
    grade: "A",
  },
];

// ── Certifications ─────────────────────────────────────────
export const CERTIFICATIONS: Certification[] = [
  {
    id: "meta-frontend",
    name: "META FRONTEND DEVELOPER",
    issuer: "Meta",
    year: 2025,
    pdfUrl: "/assets/Front End Developer.pdf",
    credentialUrl: "https://share.google/0tW5rPIgG0ROt4HS7",
    icon: "meta",
    color: "#1877F2",
    category: "Frontend Development",
  },
  {
    id: "azure-developer",
    name: "MICROSOFT AZURE DEVELOPER",
    issuer: "Microsoft",
    year: 2025,
    pdfUrl: "/assets/Azure AI Essentials.pdf",
    icon: "microsoft",
    color: "#0089D6",
    category: "Cloud Computing",
  },
  {
    id: "cybersecurity-engineer",
    name: "CYBERSECURITY ENGINEER",
    issuer: "Google",
    year: 2025,
    pdfUrl: "/assets/Cyber Security Professional.pdf",
    credentialUrl: "https://share.google/89nldAXrYSiTJCxfD",
    icon: "google",
    color: "#4285F4",
    category: "Cybersecurity",
  },
  {
    id: "aiml-engineer",
    name: "AI/ML ENGINEER",
    issuer: "Microsoft",
    year: 2025,
    pdfUrl: "/assets/AI & ML Engineering.pdf",
    credentialUrl: "https://share.google/Lg7LbpDRCH1r29smP",
    icon: "robot",
    color: "#F59E0B",
    category: "Artificial Intelligence",
  },
];

export const CERTIFICATIONS_DRIVE_URL =
  "https://drive.google.com/drive/folders/1c9x8i49PSmxRaD_USLw-6-1x-JDHPY7u?role=reader";

// ── Projects ───────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "hostel-management",
    title: "Hostel Management System",
    description:
      "This platform provides a central hub for students and wardens, simplifying daily tasks and improving communication. Students can easily update their details, submit digital leave applications, and track mess dues in one place. For wardens, it offers a streamlined dashboard to review requests, monitor payments, and maintain accurate student records—saving time and reducing paperwork for everyone.",
    tags: ["HTML", "CSS", "JavaScript"],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/UnknownHawkins/HOSTEL-MANAGEMENT-SYSTEM",
    liveUrl: "https://hostel-management-system-pearl.vercel.app/",
    status: "held",
    featured: true,
    order: 1,
    type: "2nd Year Class Project",
    imageUrl: "/assets/1.png",
  },
  {
    id: "bookhub",
    title: "BookHub — Digital Library Platform",
    description:
      "A modern React-based digital library application that allows users to discover books, manage personal libraries, and track reading progress. Features secure authentication and a beautiful dark theme interface.",
    tags: ["React", "JavaScript", "CSS", "HTML5"],
    technologies: ["React.js", "JavaScript", "CSS3", "HTML5", "Font Awesome"],
    githubUrl: "https://github.com/UnknownHawkins/BOOK_REVIEW_APP",
    liveUrl: "https://book-review-app-8sur.onrender.com/#",
    status: "completed",
    featured: true,
    order: 2,
    type: "Mini Project",
    imageUrl: "/assets/2.png",
  },
  {
    id: "careerpath-ai",
    title: "CareerPath AI",
    description:
      "CareerPath AI is an intelligent career guidance platform that uses Google's Gemini AI to provide personalized career recommendations based on your skills, interests, and goals.",
    tags: ["HTML", "CSS", "JavaScript", "Gemini AI"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Google Gemini API"],
    githubUrl: "https://github.com/UnknownHawkins/CAREERPATH-AI/tree/main",
    liveUrl: "https://careerpath-ai-neon.vercel.app/",
    status: "in_progress",
    featured: true,
    order: 3,
    type: "Hackathon Submitted Project",
    imageUrl: "/assets/3.png",
  },
  {
    id: "smart-calculator",
    title: "Smart Calculator",
    description:
      "This is a calculator that can do normal math, tell your age, and change money from one currency to another.",
    tags: ["HTML", "CSS", "JavaScript"],
    technologies: ["HTML5", "CSS3", "JavaScript"],
    githubUrl: "https://github.com/UnknownHawkins/smart-calculator",
    liveUrl: "https://smart-calculator-a6xr.onrender.com",
    status: "completed",
    featured: false,
    order: 4,
    imageUrl: "/assets/4.png",
  },
];

export const PROJECTS_SHOWCASE_URL =
  "https://unknownhawkins.github.io/Projects-Showcase/";

// ── GitHub Repos (static fallback) ────────────────────────
export const GITHUB_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "BOOK_REVIEW_APP",
    fullName: "UnknownHawkins/BOOK_REVIEW_APP",
    description:
      "A React-based book review application with modern UI and interactive features for book enthusiasts.",
    htmlUrl: "https://github.com/UnknownHawkins/BOOK_REVIEW_APP",
    language: "JavaScript",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["react", "javascript", "css"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
  {
    id: 2,
    name: "MY_PORTFOLIO",
    fullName: "UnknownHawkins/MY_PORTFOLIO",
    description:
      "Professional portfolio website built with Next.js 15, TypeScript, Tailwind CSS v4, featuring dynamic GitHub integration and admin dashboard.",
    htmlUrl: "https://github.com/UnknownHawkins/MY_PORTFOLIO",
    language: "TypeScript",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["nextjs", "typescript", "tailwind", "portfolio"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
  {
    id: 3,
    name: "PROJECTS",
    fullName: "UnknownHawkins/PROJECTS",
    description:
      "Collection of three Tkinter desktop apps: Smart Calculator, Password Generator, and To-Do List with Timer.",
    htmlUrl: "https://github.com/UnknownHawkins/PROJECTS",
    language: "Python",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["python", "tkinter", "desktop-app"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
  {
    id: 4,
    name: "FUNNY-PROJECTS",
    fullName: "UnknownHawkins/FUNNY-PROJECTS",
    description: "Collection of few funny and unique projects.",
    htmlUrl: "https://github.com/UnknownHawkins/FUNNY-PROJECTS",
    language: "JavaScript",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["fun", "javascript"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
  {
    id: 5,
    name: "SOLAR_SYSTEM",
    fullName: "UnknownHawkins/SOLAR_SYSTEM",
    description:
      "Animated solar system simulation with pure HTML and CSS, featuring planets orbiting the Sun.",
    htmlUrl: "https://github.com/UnknownHawkins/SOLAR_SYSTEM",
    language: "CSS",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["html", "css", "animation"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
  {
    id: 6,
    name: "CAREERPATH-AI",
    fullName: "UnknownHawkins/CAREERPATH-AI",
    description:
      "AI-powered insights for navigating modern career paths with intelligent recommendations.",
    htmlUrl: "https://github.com/UnknownHawkins/CAREERPATH-AI",
    homepage: "https://careerpath-ai-neon.vercel.app/",
    language: "JavaScript",
    stargazersCount: 0,
    forksCount: 0,
    watchersCount: 0,
    openIssuesCount: 0,
    topics: ["ai", "gemini", "career", "html"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    pushedAt: "2024-01-01T00:00:00Z",
    isPrivate: false,
    isFork: false,
    defaultBranch: "main",
  },
];

// ── Experience ─────────────────────────────────────────────
export const EXPERIENCE: Experience[] = [
  {
    id: "codsoft",
    title: "Python Programming Intern",
    company: "CodSoft",
    type: "internship",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    current: false,
    bullets: [
      "Undertook Python programming tasks to enhance software functionality.",
      "Applied problem-solving skills in a professional development environment.",
    ],
    technologies: ["Python"],
    icon: "python",
  },
  {
    id: "internpe",
    title: "Python Programming Intern",
    company: "InternPe",
    type: "internship",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    current: false,
    bullets: [
      "Gained practical experience in Python development and scripting.",
      "Collaborated on projects to implement new features and optimizations.",
    ],
    technologies: ["Python"],
    icon: "laptop-code",
  },
];

// ── Site Config ────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Anubhav Singh | Portfolio",
  description:
    "Full-stack developer portfolio showcasing projects in Python, Cybersecurity, Web Development, and AI/ML. Pre-final year B.Tech CSE student at GLA University.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://anubhav-portfolio.vercel.app",
  ogImage: "/og-image.png",
  keywords: [
    "Anubhav Singh",
    "portfolio",
    "developer",
    "Python",
    "cybersecurity",
    "web developer",
    "GLA University",
    "full stack",
    "React",
    "Next.js",
  ],
  twitterHandle: "@fav7659",
  githubUsername: "UnknownHawkins",
};

// ── Color Palette ──────────────────────────────────────────
export const COLORS = {
  primary: "#2563eb",
  secondary: "#64748b",
  accent: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  dark: "#0f172a",
  card: "#1e293b",
  light: "#f8fafc",
};

// ── Status Labels ──────────────────────────────────────────
export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "bg-emerald-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500" },
  held: { label: "Held", color: "bg-amber-500" },
  archived: { label: "Archived", color: "bg-slate-500" },
};
