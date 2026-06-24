# Anubhav Singh | Premium Full-Stack Portfolio Platform

Transforming a static portfolio into a production-ready, full-stack software engineer developer platform. Built using Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Prisma, and PostgreSQL.

---

## 🚀 Key Features

* **SaaS Aesthetic Layout**: Dark-first, minimalist design (Vercel/Linear aesthetic) with smooth glassmorphism containers and canvas particle overlays.
* **Database Driven Content**: Fully managed projects, skills, education, certifications, and experience segments powered by Prisma & PostgreSQL (Neon serverless).
* **Robust Offline Fallback**: Degraded/Offline mode guarantees the app displays static data dynamically if database parameters are not set.
* **GitHub Integration**: Live profile statistics, language donut grids, and star count indicators fetched from the GitHub API with Upstash Redis caching (1-hour TTL).
* **Secure Admin Panel**: Admin controls at `/admin` protected by NextAuth v5 credentials provider. Manage all skills, project records, and contact form messages.
* **Reactive Contact Form**: Hook form validated via Zod schemas. Sends message to database, runs spam checks via Upstash rate limiter, and triggers Discord webhook channel embeds.
* **Optimal SEO**: Dynamic XML sitemaps, robots configurations, structural JSON-LD schemas, and dynamic OG image generation.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 15 (App Router, Server Actions)
* **Language**: TypeScript 5
* **Styles**: Tailwind CSS v4
* **UI Components**: shadcn/ui (Radix Primitives + Lucide icons)
* **State & Query**: Zustand + React Query v5
* **ORM**: Prisma v6
* **Database**: PostgreSQL (Neon Serverless)
* **Cache & Rate Limits**: Upstash Redis
* **Auth**: NextAuth.js v5 (auth.ts)

---

## 📂 Project Structure

```
MY_PORTFOLIO/
├── _archive/                    # Archived original HTML/CSS portfolio
├── .github/                     # GitHub Actions CI workflow
├── DEPLOYMENT.md                # Detailed production deploy instructions
├── nextapp/                     # Next.js App Directory
│   ├── prisma/                  # Schema definition and seeding script
│   ├── src/
│   │   ├── app/                 # Routes, API endpoints, sitemaps
│   │   ├── components/
│   │   │   ├── admin/           # Dashboard sidebar, headers
│   │   │   ├── github/          # Stars, languages, contributions heatmap
│   │   │   ├── layout/          # Sticky Navbar, responsive Footer
│   │   │   ├── sections/        # Hero, Skills, Education, Projects, Contact
│   │   │   └── ui/              # shadcn/ui primitives (sonner, cards)
│   │   ├── lib/                 # Constants, database client, github client
│   │   ├── hooks/               # Scroll progress, viewport active observer
│   │   ├── actions/             # Safe server database CRUD actions
│   │   └── types/               # Type declarations
│   └── next.config.ts           # Security headers, image patterns config
```

---

## 🛠️ Local Development Setup

### 1. Prerequisite Installations

Ensure you have Node.js 20+ installed on your machine.

### 2. Install Project Dependencies

Go to the `nextapp/` directory and install node packages:
```bash
cd nextapp
npm install
```

### 3. Database Generation

Compile the local Prisma client library matching the schema:
```bash
npx prisma generate
```

### 4. Running the Development Server

Start the local server at port `3000`:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portfolio. Visit [/login](http://localhost:3000/login) to check the Admin sign-in screen.

---

## 📝 Seeding Content

To seed the initial content (matching the original portfolio data) to your database, make sure you configure your connection variables in `nextapp/.env.local` (see `DEPLOYMENT.md` for guidelines), then execute:
```bash
# Push schema structure to PostgreSQL
npx prisma db push

# Populate data records
npx prisma db seed
```

---

## 📄 License

This project is personal intellectual property. You cannot modify and use it freely without authorization.
