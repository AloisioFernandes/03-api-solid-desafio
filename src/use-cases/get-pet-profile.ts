import { Pet } from "../generated/prisma/client.js";
import { PetsRepository } from "../repositories/pets-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface GetPetProfileUseCaseRequest {
  petId: string;
}

interface GetPetProfileUseCaseResponse {
  pet: Pet;
}

export class GetPetProfileUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetProfileUseCaseRequest): Promise<GetPetProfileUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    return {
      pet,
    };
  }
}
