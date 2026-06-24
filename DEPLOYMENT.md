# Deployment Guide — Portfolio Platform

This document describes how to deploy the premium full-stack developer portfolio platform to **Vercel** with a serverless **Neon PostgreSQL** database and **Upstash Redis** cache.

---

## 1. Database Setup (Neon PostgreSQL)

1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project named `portfolio`.
3. In the project dashboard, copy the **Connection String**.
   * Select **Prisma** from the connection dropdown to get formatted values.
   * You will need two strings:
     * **Pooled Connection** (uses port `5432` or transaction poolers) &rarr; Save as `DATABASE_URL`
     * **Direct Connection** (uses connection string with `sslmode=require` directly to node) &rarr; Save as `DIRECT_URL` (Required for Prisma migrations)

---

## 2. Cache Setup (Upstash Redis)

1. Go to [Upstash.com](https://upstash.com) and sign up for a free account.
2. Create a new **Redis Database** in the nearest region.
3. In the database dashboard, scroll down to the **REST API** section and copy:
   * `UPSTASH_REDIS_REST_URL`
   * `UPSTASH_REDIS_REST_TOKEN`

---

## 3. Environment Variables Setup

Generate a secure 32-character secret key for NextAuth v5 session validation:
```bash
openssl rand -base64 32
```

Collect all values and write them into `.env.local` inside the `nextapp` folder for local development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Anubhav Singh | Portfolio"

DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"

NEXTAUTH_SECRET="your-generated-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_EMAIL="jonsnower07@gmail.com"
ADMIN_PASSWORD="set-your-secure-admin-password"

GITHUB_USERNAME="UnknownHawkins"
GITHUB_TOKEN="your-github-personal-access-token"

CONTACT_WEBHOOK_URL="https://discord.com/api/webhooks/your-id/your-token"

UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

---

## 4. Deploy to Vercel

1. Create a new project on [Vercel](https://vercel.com) and link your GitHub repository.
2. In the project setup panel, configure the **Root Directory** as:
   ```
   nextapp
   ```
3. Set the **Build Command** to:
   ```bash
   prisma generate && next build
   ```
4. In the **Environment Variables** section, paste all the environment keys listed above.
5. Click **Deploy**.

---

## 5. Seed the Database

Once the Vercel deployment is active, run the migrations and seed the initial database content from your local machine:

1. In the `nextapp` folder, run the following command to sync your database schema:
   ```bash
   npx prisma db push
   ```
2. Next, run the seeding script to populate skills, projects, and certifications:
   ```bash
   npx prisma db seed
   ```

You can now log in to the admin dashboard at `https://your-domain.vercel.app/login` using your configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
