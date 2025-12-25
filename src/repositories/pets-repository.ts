import { Pet, Prisma } from "../generated/prisma/client.js";

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  searchMany(location: string, page: number): Promise<Pet[]>;
}
