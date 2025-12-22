#!/usr/bin/env npx tsx
/**
 * Password Reset Script for Content Cat
 * Run with: pnpm reset-password
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";
import readline from "readline";
import fs from "fs";
import path from "path";

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          let value = valueParts.join("=").trim();
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

loadEnv();

const PBKDF2_ITERATIONS = 310000;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not found in .env file");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("\n\x1b[35m🔐 Content Cat Password Reset\x1b[0m\n");

  const { prisma, pool } = createPrismaClient();

  try {
    // List all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });

    if (users.length === 0) {
      console.log(
        "No users found. Run the app and create an account first.\n"
      );
      return;
    }

    console.log("Existing users:");
    users.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.email} ${user.name ? `(${user.name})` : ""} \x1b[90m[${user.role}]\x1b[0m`
      );
    });
    console.log();

    // Get email
    const emailInput = await prompt(
      "Enter email to reset (or number from list): "
    );

    let email: string;
    const num = parseInt(emailInput);
    if (!isNaN(num) && num >= 1 && num <= users.length) {
      email = users[num - 1].email;
    } else {
      email = emailInput;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`\n\x1b[31m✗ User not found: ${email}\x1b[0m\n`);
      return;
    }

    // Get new password
    const newPassword = await prompt("Enter new password: ");

    if (newPassword.length < 8) {
      console.log("\n\x1b[31m✗ Password must be at least 8 characters\x1b[0m\n");
      return;
    }

    // Hash and update
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Invalidate all sessions for this user
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    console.log(`\n\x1b[32m✓ Password reset for ${email}\x1b[0m`);
    console.log("  All existing sessions have been invalidated.\n");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("\x1b[31mError:\x1b[0m", e.message);
  process.exit(1);
});
