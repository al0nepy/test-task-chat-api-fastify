import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { LoginInput, LoginType, RegisterInput, RegisterType } from './account.schema.js'
import { users } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword } from '../../utils/password.js'

export async function accountRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    {
      schema: {
        description: 'Authenticate and get access',
        tags: ['Authentication'],
        body: LoginInput,
        response: {
          201: {},
          400: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginType }>, reply: FastifyReply) => {
      const { login, password } = request.body
      const user = await app.database.query.users.findFirst({
        where: eq(users.login, login),
      })

      if (!user) {
        throw app.httpErrors.conflict('Wrong credentials')
      }

      const checkPasswordResult = await verifyPassword(user.password, password)

      if (!checkPasswordResult) {
        throw app.httpErrors.conflict('Incorrect password')
      }

      reply.code(201)
    },
  )

  app.post(
    '/register',
    {
      schema: {
        description: 'Register a new user account',
        tags: ['Authentication'],
        body: RegisterInput,
        response: {
          200: {},
          401: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RegisterType }>, reply: FastifyReply) => {
      const { login, password } = request.body

      const existing = await app.database.query.users.findFirst({
        where: eq(users.login, login),
      })

      if (existing) {
        throw app.httpErrors.conflict('Email already registered')
      }

      const passwordHash = await hashPassword(password)

      await app.database.insert(users).values({
        login,
        password: passwordHash,
      })

      reply.code(200)
    },
  )
}
