import { FastifyInstance, FastifyReply } from 'fastify'
import { FastifyRequest } from 'fastify/types/request.js'

export async function healthRouter(app: FastifyInstance) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({ msg: 'Works!' })
  })

    app.get('/health', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({ msg: 'Healthy' })
  })
}
