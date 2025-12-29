import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../app.js";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
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
    });
  });
});
