import fp from 'fastify-plugin'
import fastifyRateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, {
    max: fastify.config.RATE_LIMIT_MAX,
    timeWindow: '1 minute'
  })
}, { name: 'rate-limit' })
