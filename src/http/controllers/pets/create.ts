import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makePetService } from "../../../use-cases/factories/make-pet-service.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetParamsSchema = z.object({
    organizationId: z.string().uuid(),
  });

  const createPetBodySchema = z.object({
    name: z.string(),
    breed: z.string(),
    port: z.string(),
    age: z.number(),
    location: z.string(),
  });

  const { organizationId } = createPetParamsSchema.parse(request.params);
  const { name, breed, port, age, location } = createPetBodySchema.parse(
    request.body
  );

  const petService = makePetService();

  const { pet } = await petService.execute({
    name,
    age,
    port,
    breed,
    location,
    organizationId,
  });

  return reply.status(201).send({ pet });
}
