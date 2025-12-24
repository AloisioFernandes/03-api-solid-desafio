import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrganizationsRepository } from "../repositories/memory/in-memory-organizations-repository.js";
import { InMemoryPetsRepository } from "../repositories/memory/in-memory-pets-repository.js";
import { CreatePetUseCase } from "./create-pet.js";

let petsRepository: InMemoryPetsRepository;
let organizationsRepository: InMemoryOrganizationsRepository;
let sut: CreatePetUseCase;

describe("Create Pet Use Case", () => {
  beforeEach(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository();
    sut = new CreatePetUseCase(petsRepository, organizationsRepository);

    await organizationsRepository.create({
      id: "org-01",
      name: "Org Test",
      password_hash: await hash("123456", 6),
      address: "Test Address",
      whatsapp: "11999999999",
    });
  });

  it("should be able to create a pet", async () => {
    const { pet } = await sut.execute({
      name: "Buddy",
      age: 3,
      port: "Medium",
      breed: "Labrador",
      location: "New York",
      organizationId: "org-01",
    });

    expect(pet.id).toEqual(expect.any(String));
  });
});
