import { Organization, Prisma } from "../generated/prisma/client.js";

export interface OrganizationsRepository {
  findById(id: string): Promise<Organization | null>;
  findByWhatsapp(whatsapp: string): Promise<Organization | null>;
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
}
