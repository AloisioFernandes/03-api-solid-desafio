import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { verifyUserRole } from "../../middlewares/verify-user-rolet.js";
import { create } from "./create.js";
import { profile } from "./profile.js";
import { search } from "./search.js";

export async function petsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/pets/search", search);
  app.get("/pets/:petId", profile);

  app.post(
    "/pets/:organizationId",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );
}
