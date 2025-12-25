import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsRepository } from "../repositories/memory/in-memory-pets-repository.js";
import { SearchPetsUseCase } from "./search-pets.js";

let petsRepository: InMemoryPetsRepository;
let sut: SearchPetsUseCase;

describe("Search Pets Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    sut = new SearchPetsUseCase(petsRepository);
  });

  it("should be able to search pets by location", async () => {
    await petsRepository.create({
      name: "Fido",
      age: 1,
      port: "MEDIUM",
      breed: "Labrador",
      location: "São Paulo",
      organization_id: "org-01",
    });

    await petsRepository.create({
      name: "Rex",
      age: 2,
      port: "LARGE",
      breed: "German Shepherd",
      location: "Porto Alegre",
      organization_id: "org-01",
    });

    const { pets } = await sut.execute({
      location: "São Paulo",
      page: 1,
    });

    expect(pets).toHaveLength(1);
    expect(pets).toEqual([expect.objectContaining({ name: "Fido" })]);
  });

  it("should be able to fetch paginated pets by location", async () => {
    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        name: `Pet ${i}`,
        age: 3,
        port: "SMALL",
        breed: "Beagle",
        location: "Rio de Janeiro",
        organization_id: "org-01",
      });
    }

    const { pets } = await sut.execute({
      location: "Rio de Janeiro",
      page: 2,
    });

    expect(pets).toHaveLength(2);
    expect(pets).toEqual([
      expect.objectContaining({ name: "Pet 21" }),
      expect.objectContaining({ name: "Pet 22" }),
    ]);
  });
});
