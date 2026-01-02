import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetPetProfileService } from "../../../use-cases/factories/make-get-pet-profile-service.js";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getPetProfileParamsSchema = z.object({
    petId: z.string().uuid(),
  });

  const { petId } = getPetProfileParamsSchema.parse(request.params);

  const getPetProfile = makeGetPetProfileService();

  const { pet } = await getPetProfile.execute({
    petId,
  });

  return reply.status(200).send({ pet });
}
