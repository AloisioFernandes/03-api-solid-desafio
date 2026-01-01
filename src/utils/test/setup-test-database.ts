import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../../generated/prisma/client.js";
import { generateDatabaseUrl } from "./generate-database-url.js";

export async function setupTestDatabase() {
  const schema = randomUUID();
  const databaseUrl = generateDatabaseUrl(schema);

  process.env.DATABASE_URL = databaseUrl;

  execSync("npx prisma db push");

  const testPrisma = new PrismaClient({
    log: process.env.NODE_ENV === "dev" ? ["query"] : [],
  });

  return { prisma: testPrisma, schema };
}

export async function teardownTestDatabase(schema: string, testPrisma: PrismaClient) {
  await testPrisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await testPrisma.$disconnect();
}