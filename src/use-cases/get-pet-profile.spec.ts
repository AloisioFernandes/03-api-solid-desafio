import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsRepository } from "../repositories/memory/in-memory-pets-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { GetPetProfileUseCase } from "./get-pet-profile.js";

let petsRepository: InMemoryPetsRepository;
let sut: GetPetProfileUseCase;

describe("Get Pet Profile Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    sut = new GetPetProfileUseCase(petsRepository);
  });

  it("should be able to get pet profile", async () => {
    const createdPet = await petsRepository.create({
      name: "Buddy",
      age: 3,
      port: "Medium",
      breed: "Labrador",
      location: "New York",
      organization_id: "org-123",
    });

    const { pet } = await sut.execute({ petId: createdPet.id });

    expect(pet.id).toEqual(createdPet.id);
    expect(pet.name).toEqual("Buddy");
  });

  it(" should not be able to get pet profile with wrong id", async () => {
    await expect(() =>
      sut.execute({ petId: "non-existing-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
