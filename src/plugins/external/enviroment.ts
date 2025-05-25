import fp from 'fastify-plugin'
import env, { FastifyEnvOptions } from '@fastify/env'
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      PORT: number
      DATABASE_URL: string
      RATE_LIMIT_MAX: number
      UPLOAD_DIRNAME: string
      UPLOAD_TASKS_DIRNAME: string
    }
  }
}

const schema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: {
      type: 'string',
      default: 'localhost',
    },
    RATE_LIMIT_MAX: {
      type: 'number',
      default: 100,
    },
    UPLOAD_DIRNAME: {
      type: 'string',
      minLength: 1,
      pattern: String.raw`^(?!.*\.{2}).*$`,
      default: 'uploads',
    },
    UPLOAD_TASKS_DIRNAME: {
      type: 'string',
      default: 'tasks',
    },
  },
}

const environmentConfig: FastifyEnvOptions = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env,
}

export default fp(
  async (fastify: FastifyInstance): Promise<void> => {
    await fastify.register(env, environmentConfig)
  },
  { name: 'env' },
)
