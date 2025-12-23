import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrganizationsRepository } from "../repositories/memory/in-memory-organizations-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new AuthenticateUseCase(organizationsRepository);
  });

  it("should be able to authenticate", async () => {
    await organizationsRepository.create({
      name: "Org Test",
      address: "Test Address",
      whatsapp: "11999999999",
      password_hash: await hash("123456", 6),
    });

    const { organization } = await sut.execute({
      whatsapp: "11999999999",
      password: "123456",
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong whatsapp", async () => {
    await expect(() =>
      sut.execute({
        whatsapp: "11999999999",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await organizationsRepository.create({
      name: "Org Test",
      address: "Test Address",
      whatsapp: "11999999999",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        whatsapp: "11999999999",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
