import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "../../../generated/prisma/client.js";

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined.");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

describe("Register (e2e)", () => {
  let schema: string;
  let prisma: PrismaClient;
  let app: any;

  beforeAll(async () => {
    schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma db push");

    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "dev" ? ["query"] : [],
    });

    const appModule = await import("../../../app.js");
    app = appModule.app;

    await app.ready();
  });

  afterAll(async () => {
    await app.close();

    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
    );
    await prisma.$disconnect();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/organizations").send({
      name: "Org Test",
      address: "Rua Test, 123",
      whatsapp: "11999999999",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
