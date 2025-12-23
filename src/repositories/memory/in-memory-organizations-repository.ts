import { randomUUID } from "node:crypto";
import { Organization, Prisma } from "../../generated/prisma/client.js";
import { OrganizationsRepository } from "../organizations-repository.js";

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public items: Organization[] = [];

  async findByWhatsapp(whatsapp: string): Promise<Organization | null> {
    const organization = this.items.find((item) => item.whatsapp === whatsapp);

    if (!organization) {
      return null;
    }

    return organization;
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      name: data.name,
      password_hash: data.password_hash,
      address: data.address,
      whatsapp: data.whatsapp,
      created_at: new Date(),
    };

    this.items.push(organization);

    return organization;
  }
}
