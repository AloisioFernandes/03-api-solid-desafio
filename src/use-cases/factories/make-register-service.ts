import { PrismaOrganizationsRepository } from "../../repositories/prisma/prisma-organizations-repository.js";
import { RegisterUseCase } from "../register.js";

export function makeRegisterService() {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const registerUseCase = new RegisterUseCase(organizationsRepository);

  return registerUseCase;
}
