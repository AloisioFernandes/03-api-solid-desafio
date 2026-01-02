import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrganizationAlreadyExistsError } from "../../../use-cases/errors/organization-already-exists-error.js";
import { makeRegisterService } from "../../../use-cases/factories/make-register-service.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    address: z.string(),
    whatsapp: z.string(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  });

  const { name, address, whatsapp, password, role } = registerBodySchema.parse(
    request.body
  );

  try {
    const registerService = makeRegisterService();

    await registerService.execute({ name, address, whatsapp, password, role });
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
