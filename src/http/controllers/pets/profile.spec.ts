import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { prisma as prismaDB } from "../../../db/prisma.js";
import { createAndAuthenticateOrganization } from "../../../utils/test/create-and-authenticate-organization.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../../utils/test/setup-test-database.js";

describe("Get Pet Profile (e2e)", () => {
  let schema: string;
  let prisma: any;

  beforeAll(async () => {
    const { prisma: testPrisma, schema: testSchema } =
      await setupTestDatabase();
    prisma = testPrisma;
    schema = testSchema;

    await app.ready();
  });

  afterAll(async () => {
    await app.close();

    await teardownTestDatabase(schema, prisma);
  });

  it("should be able to get a pet profile", async () => {
    const { token, organization } = await createAndAuthenticateOrganization(
      app,
      false
    );

    const pet = await prismaDB.pet.create({
      data: {
        name: "Bella",
        age: 3,
        port: "Small",
        breed: "Labrador",
        location: "New York",
        organization_id: organization.id,
      },
    });

    const response = await request(app.server)
      .get(`/pets/${pet.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: "Bella",
      })
    );
  });
});
