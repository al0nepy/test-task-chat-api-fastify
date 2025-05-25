import { FastifyInstance } from 'fastify'
import fastifyUnderPressure from '@fastify/under-pressure'
import fp from 'fastify-plugin'

export const autoConfig = (fastify: FastifyInstance) => {
  return {
    maxEventLoopDelay: 100,
    maxHeapUsedBytes: 100_000_000,
    maxRssBytes: 100_000_000,
    maxEventLoopUtilization: 0.98,
    message: 'The server is under pressure, retry later!',
    retryAfter: 50,
    healthCheck: async () => {
      try {
        return true
      } catch (error) {
        fastify.log.error(error, 'healthCheck has failed')
        throw new Error('Database connection is not available')
      }
    },
    healthCheckInterval: 5000
  }
}

export default fp(fastifyUnderPressure, {
  dependencies: ['drizzle']
})
