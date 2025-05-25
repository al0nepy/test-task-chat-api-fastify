import fp from 'fastify-plugin'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { FastifyInstance } from 'fastify'
import * as schema from '../../db/schema.js'

export default fp(async (fastify: FastifyInstance) => {
  const queryClient = postgres(process.env.DATABASE_URL!)
  const database = drizzle({
    client: queryClient,
    connection: {
      ssl: false,
    },
    schema,
  })

  fastify.decorate('database', database)
}, {
  name: 'drizzle',
  dependencies: ['env']
})
