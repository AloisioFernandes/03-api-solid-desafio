import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { createAndAuthenticateOrganization } from "../../../utils/test/create-and-authenticate-organization.js";
import { generateDatabaseUrl } from "../../../utils/test/generate-database-url.js";

describe("Search Pets (e2e)", () => {
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

  it("should be able to search a pet", async () => {
    const { token, organization } = await createAndAuthenticateOrganization(
      app,
      true
    );

    await request(app.server)
      .post(`/pets/${organization.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Buddy",
        age: 3,
        port: "Medium",
        breed: "Labrador",
        location: "New York",
      });

    await request(app.server)
      .post(`/pets/${organization.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pal",
        age: 3,
        port: "Medium",
        breed: "Labrador",
        location: "Salvador",
      });

    const response = await request(app.server)
      .get("/pets/search")
      .query({ location: "Salvador" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: "Pal" }),
    ]);
  });
});
