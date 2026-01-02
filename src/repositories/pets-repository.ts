import { Pet, Prisma } from "../generated/prisma/client.js";

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  findById(id: string): Promise<Pet | null>;
  searchMany(
    location: string,
    page: number,
    optionalFilters?: {
      age?: number | undefined;
      port?: string | undefined;
      breed?: string | undefined;
      organization_id?: string | undefined;
    }
  ): Promise<Pet[]>;
}
