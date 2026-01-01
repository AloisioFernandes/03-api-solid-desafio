import { PrismaPetsRepository } from "../../repositories/prisma/prisma-pets-repository.js";
import { SearchPetsUseCase } from "../search-pets.js";

export function makeSearchPetsService() {
  const petsRepository = new PrismaPetsRepository();
  const useCase = new SearchPetsUseCase(petsRepository);

  return useCase;
}
