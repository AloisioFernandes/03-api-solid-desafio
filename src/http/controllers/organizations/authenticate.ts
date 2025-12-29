import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credentials-error.js";
import { makeAuthenticateService } from "../../../use-cases/factories/make-authenticate-service.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    whatsapp: z.string(),
    password: z.string().min(6),
  });

  const { whatsapp, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateService();

    const { organization } = await authenticateService.execute({
      whatsapp,
      password,
    });

    const token = await reply.jwtSign(
      {
        role: organization.role,
      },
      {
        sign: {
          sub: organization.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        role: organization.role,
      },
      {
        sign: {
          sub: organization.id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
