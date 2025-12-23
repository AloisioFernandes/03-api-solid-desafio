import { Organization, Prisma } from "../generated/prisma/client.js";

export interface OrganizationsRepository {
  findByWhatsapp(whatsapp: string): Promise<Organization | null>;
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
}
