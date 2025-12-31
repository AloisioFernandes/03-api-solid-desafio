import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { verifyUserRole } from "../../middlewares/verify-user-rolet.js";
import { create } from "./create.js";

export async function petsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/pets/:organizationId",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );
}
