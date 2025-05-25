import fp from 'fastify-plugin'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifySwagger from '@fastify/swagger'

export default fp(async function (fastify) {
  await fastify.register(fastifySwagger, {
    hideUntagged: true,
    openapi: {
      info: {
        title: 'Fastify Chat API',
        description: 'Chat API',
        version: '0.1.0',
      },
      components: {
        securitySchemes: {
          basicAuth: {
            type: 'http',
            scheme: 'basic',
          },
        },
      },
    },
  })

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
  })
})
