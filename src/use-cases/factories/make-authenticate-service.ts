import { PrismaOrganizationsRepository } from "../../repositories/prisma/prisma-organizations-repository.js";
import { AuthenticateUseCase } from "../authenticate.js";

export function makeAuthenticateService() {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const authenticateUseCase = new AuthenticateUseCase(organizationsRepository);

  return authenticateUseCase;
}
