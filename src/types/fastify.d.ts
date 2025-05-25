import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { User } from '../db/schema.ts'

declare module 'fastify' {
  interface FastifyInstance {
    database: PostgresJsDatabase<typeof schema>
  }

  interface FastifyRequest {
    user?: User
  }
}
