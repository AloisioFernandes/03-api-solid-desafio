import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { prisma } from "../../db/prisma.js";

export async function createAndAuthenticateOrganization(
  app: FastifyInstance,
  isAdmin = false
) {
  const whatsapp = `209999${Math.floor(Math.random() * 100000)}`;

  const organization = await prisma.organization.create({
    data: {
      name: "Org Test",
      address: "Rua Test, 123",
      whatsapp,
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    whatsapp,
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, organization };
}
