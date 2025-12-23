export class OrganizationAlreadyExistsError extends Error {
  constructor() {
    super("Organization with this whatsapp already exists.");
  }
}
