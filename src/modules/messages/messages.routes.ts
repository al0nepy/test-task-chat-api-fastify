import fs, { createWriteStream } from 'node:fs'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  MessageResponse,
  MessageTextCreate,
  MessageListParameters,
  MessageTextCreateType,
  MessageListParametersType,
} from './messages.schema.js'
import { messages } from '../../db/schema.js'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { Type } from '@sinclair/typebox'
import { desc, eq, gt } from 'drizzle-orm'
import { MultipartFile } from '@fastify/multipart'

const pump = promisify(pipeline)

export async function messagesRoutes(app: FastifyInstance) {
  app.after(() => {
    app.addHook('onRequest', app.basicAuth)

    app.post(
      '/text',
      {
        schema: {
          body: MessageTextCreate,
          response: {
            201: MessageResponse,
            400: { $ref: 'ErrorResponse#' },
            401: { $ref: 'ErrorResponse#' }
          },
          description: 'Create a new text message',
          tags: ['Messages'],
          security: [{ basicAuth: [] }],
        },
      },
      async (request: FastifyRequest<{ Body: MessageTextCreateType }>, reply: FastifyReply) => {
        const { content } = request.body
        const { user } = request

        const message = await app.database
          .insert(messages)
          .values({
            type: 'text',
            content,
            user: user?.login,
          })
          .returning()

        return reply.code(200).send(message)
      },
    )

    app.post(
      '/file',
      {
        schema: {
          description: 'Upload a file message (JPEG/PNG/PDF under 2MB)',
          tags: ['Messages'],
          consumes: ['multipart/form-data'],
          security: [{ basicAuth: [] }],
          body: {
            type: 'object',
            required: ['file'],
            properties: {
              file: {
                isFile: true
              }
            }
          },
          response: {
            201: MessageResponse,
            400: { $ref: 'ErrorResponse#' },
            401: { $ref: 'ErrorResponse#' },
            413: { $ref: 'ErrorResponse#' },
            415: { $ref: 'ErrorResponse#' }
          },
        },
      },
      async (request: FastifyRequest<{ Body: { file: MultipartFile } }>, reply: FastifyReply) => {
        const { file } = await request.body
        const { user } = request

        if (!file) {
          throw app.httpErrors.badRequest('No file uploaded')
        }

        const fileExtension = path.extname(file.filename)
        const fileName = `${uuidv4()}${fileExtension}`
        const filePath = path.join(import.meta.dirname, `../../../uploads/${fileName}`)

        const writeStream = createWriteStream(filePath)
        await pipeline(file.file, writeStream)

        await app.database
          .insert(messages)
          .values({
            user: user?.login,
            fileName,
            filePath: filePath,
            fileMimeType: file.mimetype,
            type: 'file',
          })
        return reply.code(201)
      },
    )

    app.get(
      '/',
      {
        schema: {
          description: 'List messages with cursor pagination',
          tags: ['Messages'],
          security: [{ basicAuth: [] }],
          querystring: MessageListParameters,
          response: {
            200: Type.Object({
              items: Type.Array(MessageResponse),
              nextCursor: Type.Optional(Type.String()),
            }),
            401: { $ref: 'ErrorResponse#' }
          },
        },
      },
      async (request: FastifyRequest<{ Querystring: MessageListParametersType }>, reply: FastifyReply) => {
        const { limit = 10, cursor } = request.query
        const query = app.database
          .select()
          .from(messages)
          .where(cursor ? gt(messages.id, cursor) : undefined)
          .orderBy(desc(messages.createdAt))
          .limit(limit)
        const results = await query.execute()
        const hasNextPage = results.length > limit
        const items = hasNextPage ? results.slice(0, -1) : results

        return reply.code(200).send({
          items,
          nextCursor: hasNextPage ? items.at(-1)?.id : undefined,
        })
      },
    )

    app.get(
      '/content',
      {
        schema: {
          querystring: Type.Object({ id: Type.Number() }),
          description: 'Get message content',
          tags: ['Messages'],
          security: [{ basicAuth: [] }],
        },
      },
      async (request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) => {
        const { id } = request.query
        const message = await app.database.query.messages.findFirst({
          where: eq(messages.id, id),
        })

        if (!message) {
          throw app.httpErrors.notFound('Message not found')
        }

        if (message.type === 'text') {
          return reply.type('text/plain').send(message.content)
        }

        if (message.type === 'file') {
          const filePath = path.join(import.meta.dirname, '/uploads', message.content)

          if (!fs.existsSync(filePath)) {
            return reply.status(404).send({ error: 'File not found' })
          }

          return reply.type(message.fileMimeType || 'application/octet-stream').send(fs.createReadStream(filePath))
        }
      },
    )
  })
}
