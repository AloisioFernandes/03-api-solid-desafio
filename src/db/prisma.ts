import { env } from "../env/index.js";
import { PrismaClient } from "../generated/prisma/client.js";

let _prisma: PrismaClient;

export const prisma = new Proxy({}, {
  get(target, prop) {
    if (!_prisma) {
      _prisma = new PrismaClient({
        log: env.NODE_ENV === "dev" ? ["query"] : [],
      });
    }
    return (_prisma as any)[prop];
  },
}) as PrismaClient;
