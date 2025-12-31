import { prisma } from "../../db/prisma.js";
import { Pet, Prisma } from "../../generated/prisma/client.js";
import { PetsRepository } from "../pets-repository.js";

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    });

    return pet;
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    return pet;
  }

  async searchMany(
    location: string,
    page: number,
    optionalFilters?: {
      age?: number;
      port?: string;
      breed?: string;
      organization_id?: string;
    }
  ): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        location,
        ...optionalFilters,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return pets;
  }
}
