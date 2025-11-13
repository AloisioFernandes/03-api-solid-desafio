import type { Organization } from "../generated/prisma/client";

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
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {}
}
