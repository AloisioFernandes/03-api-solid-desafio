import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { createAndAuthenticateOrganization } from "../../../utils/test/create-and-authenticate-organization.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../../utils/test/setup-test-database.js";

describe("Search Pets (e2e)", () => {
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
        location: organization.address,
      });

    const response = await request(app.server)
      .get("/pets/search")
      .query({ location: organization.address })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets).toEqual([
      expect.objectContaining({ name: "Pal" }),
    ]);
  });

  it("should be able to search a pet with optional filters", async () => {
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
        age: 4,
        port: "Medium",
        breed: "Labrador",
        location: "New York",
      });

    await request(app.server)
      .post(`/pets/${organization.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Chad",
        age: 4,
        port: "Medium",
        breed: "German Shepherd",
        location: "New York",
      });

    const response = await request(app.server)
      .get("/pets/search")
      .query({ location: "New York", age: 4, breed: "German Shepherd" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets).toEqual([
      expect.objectContaining({
        name: "Chad",
        age: 4,
        breed: "German Shepherd",
      }),
    ]);
  });
});
