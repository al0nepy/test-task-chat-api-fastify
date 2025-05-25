import fastify from 'fastify'
import { getLoggerOptions } from './utils'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

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
  await app.ready()

  try {
    await app.listen({ port: 3000 })
  } catch (error) {
    app.log.error(error)
    await app.close()
  }
}

init()
