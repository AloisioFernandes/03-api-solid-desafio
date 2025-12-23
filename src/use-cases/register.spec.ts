import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrganizationsRepository } from "../repositories/memory/in-memory-organizations-repository.js";
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists-error.js";
import { RegisterUseCase } from "./register.js";

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new RegisterUseCase(organizationsRepository);
  });

  it("should be able to register", async () => {
    const { organization } = await sut.execute({
      name: "Org Test",
      password: "123456",
      address: "Test Address",
      whatsapp: "11999999999",
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it("should hash organization password upon registration", async () => {
    const { organization } = await sut.execute({
      name: "Org Test",
      password: "123456",
      address: "Test Address",
      whatsapp: "11999999999",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      organization.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same whatsapp twice", async () => {
    const whatsapp = "11999999999";

    await sut.execute({
      name: "Org Test",
      password: "123456",
      address: "Test Address",
      whatsapp,
    });

    await expect(() =>
      sut.execute({
        name: "Org Test 2",
        password: "654321",
        address: "Test Address 2",
        whatsapp,
      })
    ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError);
  });
});
