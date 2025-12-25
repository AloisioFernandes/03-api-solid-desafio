import { Pet, Prisma } from "../generated/prisma/client.js";

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  searchMany(
    location: string,
    page: number,
    optionalFilters?: {
      age?: number;
      port?: string;
      breed?: string;
      organization_id?: string;
    }
  ): Promise<Pet[]>;
}
