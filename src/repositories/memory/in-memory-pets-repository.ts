import { randomUUID } from "node:crypto";
import { Pet, Prisma } from "../../generated/prisma/client.js";
import { PetsRepository } from "../pets-repository.js";

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = [];

  async findById(id: string): Promise<Pet | null> {
    const pet = this.items.find((item) => item.id === id);

    if (!pet) {
      return null;
    }

    return pet;
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: randomUUID(),
      name: data.name,
      age: data.age,
      port: data.port,
      breed: data.breed,
      location: data.location,
      organization_id: data.organization_id,
      created_at: new Date(),
    };

    this.items.push(pet);

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
    return this.items
      .filter((item) =>
        item.location.toLowerCase().includes(location.toLowerCase())
      )
      .filter((item) => {
        return Object.entries(optionalFilters || {}).every(([key, value]) => {
          if (value === undefined) return true;

          return item[key as keyof Pet] === value;
        });
      })
      .slice((page - 1) * 20, page * 20);
  }
}
