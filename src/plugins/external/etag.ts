import fp from 'fastify-plugin'
import etag from '@fastify/etag'
import { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(etag)
})
