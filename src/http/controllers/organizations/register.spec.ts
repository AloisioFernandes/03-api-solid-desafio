import "dotenv/config";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../../../utils/test/setup-test-database.js";

describe("Register (e2e)", () => {
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
