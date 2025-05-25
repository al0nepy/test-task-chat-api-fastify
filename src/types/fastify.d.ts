import { Drizzle } from 'drizzle-orm'

declare module 'fastify' {
  interface FastifyInstance {
    database: Drizzle;
  }
}
