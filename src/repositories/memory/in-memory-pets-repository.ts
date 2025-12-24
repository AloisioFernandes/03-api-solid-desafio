import { randomUUID } from "node:crypto";
import { Pet, Prisma } from "../../generated/prisma/client.js";
import { PetsRepository } from "../pets-repository.js";

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = [];

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
}
