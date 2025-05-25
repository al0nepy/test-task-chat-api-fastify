import path from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { accountRoutes } from './modules/account/account.routes.js'
import { messagesRoutes } from './modules/messages/messages.routes.js'

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

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(
      {
        error,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      'Unhandled error occurred',
    )

    reply.code(error.statusCode ?? 500)

    let message = 'Internal Server Error'

    if (error.statusCode && error.statusCode < 500) {
      message = error.message
    }

    return { message }
  })

  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 3,
        timeWindow: 500,
      }),
    },
    (request, reply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found',
      )

      reply.code(404)

      return { message: 'Not Found' }
    },
  )
}
