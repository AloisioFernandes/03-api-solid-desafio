import "dotenv/config";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { createAndAuthenticateOrganization } from "../../../utils/test/create-and-authenticate-organization.js";
import { generateDatabaseUrl } from "../../../utils/test/generate-database-url.js";

describe("Create Pet (e2e)", () => {
  let schema: string;
  let prisma: PrismaClient;

  beforeAll(async () => {
    schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma db push");

    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "dev" ? ["query"] : [],
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();

    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await prisma.$disconnect();
  });

  it("should be able to create a pet", async () => {
    const { token, organization } = await createAndAuthenticateOrganization(
      app,
      true
    );

    const response = await request(app.server)
      .post(`/pets/${organization.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Buddy",
        age: 3,
        port: "Medium",
        breed: "Labrador",
        location: "New York",
      });

    expect(response.statusCode).toEqual(201);
  });
});
