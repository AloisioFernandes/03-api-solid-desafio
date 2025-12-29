import { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate.js";
import { refresh } from "./refresh.js";
import { register } from "./register.js";

export async function organizationsRoutes(app: FastifyInstance) {
  app.post("/organizations", register);

  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);
}
