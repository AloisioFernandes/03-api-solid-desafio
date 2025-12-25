import { Pet } from "../generated/prisma/client.js";
import { PetsRepository } from "../repositories/pets-repository.js";

interface SearchPetsUseCaseRequest {
  location: string;
  page: number;
}

interface SearchPetUseCaseResponse {
  pets: Pet[];
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    location,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetUseCaseResponse> {
    const pets = await this.petsRepository.searchMany(location, page);

    return { pets };
  }
}
