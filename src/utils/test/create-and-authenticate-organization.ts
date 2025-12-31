import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { prisma } from "../../db/prisma.js";

export async function createAndAuthenticateOrganization(
  app: FastifyInstance,
  isAdmin = false
) {
  const organization = await prisma.organization.create({
    data: {
      name: "Org Test",
      address: "Rua Test, 123",
      whatsapp: "15999999999",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    whatsapp: "15999999999",
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, organization };
}
