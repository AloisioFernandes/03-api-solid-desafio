import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchPetsService } from "../../../use-cases/factories/make-search-pets-service.js";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    location: z.string(),
    page: z.coerce.number().min(1).default(1),
    age: z.coerce.number().optional(),
    port: z.string().optional(),
    breed: z.string().optional(),
    organization_id: z.string().optional(),
  });

  const { location, page, age, port, breed, organization_id } =
    searchPetsQuerySchema.parse(request.query);

  const searchPetsService = makeSearchPetsService();

  const { pets } = await searchPetsService.execute({
    location,
    page,
    optionalFilters: {
      age,
      port,
      breed,
      organization_id,
    },
  });

  return reply.status(200).send({ pets });
}
