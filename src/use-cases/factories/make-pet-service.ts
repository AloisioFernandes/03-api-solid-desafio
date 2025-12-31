import { PrismaOrganizationsRepository } from "../../repositories/prisma/prisma-organizations-repository.js";
import { PrismaPetsRepository } from "../../repositories/prisma/prisma-pets-repository.js";
import { CreatePetUseCase } from "../create-pet.js";

export function makePetService() {
  const petsRepository = new PrismaPetsRepository();
  const organizationsRepository = new PrismaOrganizationsRepository();

  const useCase = new CreatePetUseCase(petsRepository, organizationsRepository);

  return useCase;
}
