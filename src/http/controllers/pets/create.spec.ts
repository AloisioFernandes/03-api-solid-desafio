import "dotenv/config";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { createAndAuthenticateOrganization } from "../../../utils/test/create-and-authenticate-organization.js";
import { setupTestDatabase, teardownTestDatabase } from "../../../utils/test/setup-test-database.js";

describe("Create Pet (e2e)", () => {
  let schema: string;
  let prisma: any;

  beforeAll(async () => {
    const { prisma: testPrisma, schema: testSchema } = await setupTestDatabase();
    prisma = testPrisma;
    schema = testSchema;

    await app.ready();
  });

  afterAll(async () => {
    await app.close();

    await teardownTestDatabase(schema, prisma);
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
