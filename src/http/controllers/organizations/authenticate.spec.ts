import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../../utils/test/setup-test-database.js";

describe("Authenticate (e2e)", () => {
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

  it("should be able to authenticate", async () => {
    await request(app.server).post("/organizations").send({
      name: "Org Example",
      address: "123 Main St",
      whatsapp: "1234567890",
      password: "securepassword",
    });

    const response = await request(app.server).post("/sessions").send({
      whatsapp: "1234567890",
      password: "securepassword",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      organization: expect.objectContaining({
        whatsapp: "1234567890",
      }),
    });
  });
});
