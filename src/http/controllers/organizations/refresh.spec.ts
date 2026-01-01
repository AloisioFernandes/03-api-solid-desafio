import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";
import { setupTestDatabase, teardownTestDatabase } from "../../../utils/test/setup-test-database.js";

describe("Refresh Token (e2e)", () => {
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

  it("should be able to refresh token", async () => {
    await request(app.server).post("/organizations").send({
      name: "Org Refresh",
      address: "123 Main St",
      whatsapp: "555-1234",
      password: "securepassword",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      whatsapp: "555-1234",
      password: "securepassword",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies!)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });

    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
