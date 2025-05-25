import path from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { accountRoutes } from './modules/account/account.routes.js'
import { messagesRoutes } from './modules/messages/messages.routes.js'
import { healthRouter } from './modules/health/health.routes.js'

export const options = {
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all',
    },
  },
}

export default async function serviceApp(fastify: FastifyInstance, options_: FastifyPluginOptions) {
  await fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, 'plugins/external'),
    options: { ...options_ },
  })

  fastify.register(accountRoutes, { prefix: 'api/account' })
  fastify.register(messagesRoutes, { prefix: 'api/message' })
  fastify.register(healthRouter)
}
