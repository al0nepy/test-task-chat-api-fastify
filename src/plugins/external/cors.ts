import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const corsConfig: FastifyCorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

export default fp(
  async (fastify: FastifyInstance): Promise<void> => {
    await fastify.register(cors, corsConfig)
  },
  { name: 'cors' },
)
