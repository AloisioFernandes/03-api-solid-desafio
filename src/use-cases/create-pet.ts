import { Pet } from "../generated/prisma/client.js";
import { OrganizationsRepository } from "../repositories/organizations-repository.js";
import { PetsRepository } from "../repositories/pets-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface CreatePetUseCaseRequest {
  name: string;
  age: number;
  port: string;
  breed: string;
  location: string;
  organizationId: string;
}

interface CreatePetUseCaseResponse {
  pet: Pet;
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private organizationsRepository: OrganizationsRepository
  ) {}

  async execute({
    name,
    age,
    port,
    breed,
    location,
    organizationId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.organizationsRepository.findById(organizationId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const pet = await this.petsRepository.create({
      name,
      age,
      port,
      breed,
      location,
      organization_id: organizationId,
    });

    return { pet };
  }
}
