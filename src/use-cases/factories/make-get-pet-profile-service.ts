import { PrismaPetsRepository } from "../../repositories/prisma/prisma-pets-repository.js";
import { GetPetProfileUseCase } from "../get-pet-profile.js";

export function makeGetPetProfileService() {
  const petsRepository = new PrismaPetsRepository();
  const useCase = new GetPetProfileUseCase(petsRepository);

  return useCase;
}
