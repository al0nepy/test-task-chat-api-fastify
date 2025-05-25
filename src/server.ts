/* eslint-disable unicorn/no-process-exit */
import fastify from 'fastify'
import fp from 'fastify-plugin'
import { getLoggerOptions } from './utils/logger-options.js'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import serviceApp from './app.js'

const app = fastify({
  logger: getLoggerOptions(),
  ajv: {
    customOptions: {
      coerceTypes: 'array',
      removeAdditional: 'all',
      useDefaults: true,
      allErrors: false
    }
  }
}).withTypeProvider<TypeBoxTypeProvider>()

async function init() {
  app.register(fp(serviceApp))
  await app.ready()

  try {
    await app.listen({ port: 3000 })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

async function shutdown(signal: string) {
  try {
    app.log.info(`Received ${signal}. Initiating graceful shutdown...`)
    await app.close()

    app.log.info('Server has been shut down gracefully.')
    process.exit(0)
  } catch (error) {
    app.log.error('Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

init()
