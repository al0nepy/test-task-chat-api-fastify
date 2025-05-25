import fp from 'fastify-plugin'
import basicAuth from '@fastify/basic-auth'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { eq } from 'drizzle-orm'
import { verifyPassword } from '../../utils/password.js'
import { users } from '../../db/schema.js'

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(basicAuth, {
    validate: async (
      login: string,
      password: string,
      request: FastifyRequest,
    ) => {
      const user = await fastify.database.query.users.findFirst({
        where: eq(users.login, login)
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const passwordCheckResult = await verifyPassword(user.password, password)

      if (!passwordCheckResult) {
        throw new Error('Invalid password')
      }

      request.user = user
    },
    authenticate: true,
  })
}, {
  name: 'basic-auth',
  dependencies: ['drizzle']
})
