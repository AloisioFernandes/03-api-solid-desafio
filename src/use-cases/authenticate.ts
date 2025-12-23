import { compare } from "bcryptjs";
import { Organization } from "../generated/prisma/client.js";
import { OrganizationsRepository } from "../repositories/organizations-repository.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

interface AuthenticateUseCaseRequest {
  whatsapp: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  organization: Organization;
}

export class AuthenticateUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    whatsapp,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationsRepository.findByWhatsapp(
      whatsapp
    );

    if (!organization) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(
      password,
      organization.password_hash
    );

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { organization };
  }
}
