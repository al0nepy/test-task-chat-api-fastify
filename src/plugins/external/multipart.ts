import fp from 'fastify-plugin'
import multipart from '@fastify/multipart'
import { FastifyInstance } from 'fastify'

const multipartConfig = {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 2 * 1024 * 1024,
    files: 1,
    parts: 1000
  }
}

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(multipart, multipartConfig)
}, { name: 'multipart' })

