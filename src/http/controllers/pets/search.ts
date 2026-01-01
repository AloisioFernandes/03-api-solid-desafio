import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchPetsService } from "../../../use-cases/factories/make-search-pets-service.js";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    location: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { location, page } = searchPetsQuerySchema.parse(request.query);

  const searchPetsService = makeSearchPetsService();

  const { pets } = await searchPetsService.execute({
    location,
    page,
  });

  return reply.status(200).send({ pets });
}
