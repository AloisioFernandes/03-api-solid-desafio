import { prisma } from "../../db/prisma.js";
import { Organization, Prisma } from "../../generated/prisma/client.js";
import { OrganizationsRepository } from "../organizations-repository.js";

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({
      data,
    });

    return organization;
  }

  findById(id: string): Promise<Organization | null> {
    const organization = prisma.organization.findUnique({
      where: {
        id,
      },
    });

    return organization;
  }

  findByWhatsapp(whatsapp: string): Promise<Organization | null> {
    const organization = prisma.organization.findUnique({
      where: {
        whatsapp,
      },
    });

    return organization;
  }
}
