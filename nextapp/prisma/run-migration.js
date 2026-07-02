const { execSync } = require("child_process");
const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

// Load .env variables manually
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      process.env[key.trim()] = value;
    }
  });
}

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env");
  process.exit(1);
}

async function main() {
  console.log("Generating migration SQL via Prisma...");
  
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { cwd: path.join(__dirname, ".."), encoding: "utf-8" }
  );

  console.log("Connecting to Turso database...");
  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });

  // Split by semicolon
  const statements = sql
    .split(";")
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  console.log(`Executing ${statements.length} SQL statements on Turso...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    try {
      await client.execute(stmt);
    } catch (err) {
      if (err.message && err.message.includes("already exists")) {
        console.log("  (Table or index already exists, skipping...)");
      } else {
        console.error(`Error executing statement: ${stmt}`);
        console.error(err);
        process.exit(1);
      }
    }
  }

  console.log("Migration applied successfully!");
  client.close();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
