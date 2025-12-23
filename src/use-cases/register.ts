import { hash } from "bcryptjs";
import type { Organization } from "../generated/prisma/client.js";
import { OrganizationsRepository } from "../repositories/organizations-repository.js";
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists-error.js";

interface RegisterUseCaseRequest {
  name: string;
  password: string;
  address: string;
  whatsapp: string;
}

interface RegisterUseCaseResponse {
  organization: Organization;
}

export class RegisterUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    name,
    password,
    address,
    whatsapp,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const organizationWithSameWhatsapp =
      await this.organizationsRepository.findByWhatsapp(whatsapp);

    if (organizationWithSameWhatsapp) {
      throw new OrganizationAlreadyExistsError();
    }

    const organization = await this.organizationsRepository.create({
      name,
      password_hash,
      address,
      whatsapp,
    });

    return { organization };
  }
}
