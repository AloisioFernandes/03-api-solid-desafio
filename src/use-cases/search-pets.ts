import { Pet } from "../generated/prisma/client.js";
import { PetsRepository } from "../repositories/pets-repository.js";

interface SearchPetsUseCaseRequest {
  location: string;
  page: number;
  optionalFilters?: {
    age?: number;
    port?: string;
    breed?: string;
    organization_id?: string;
  };
}

interface SearchPetUseCaseResponse {
  pets: Pet[];
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    location,
    page,
    optionalFilters,
  }: SearchPetsUseCaseRequest): Promise<SearchPetUseCaseResponse> {
    const pets = await this.petsRepository.searchMany(
      location,
      page,
      optionalFilters
    );

    return { pets };
  }
}
