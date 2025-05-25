import { Static, Type } from '@sinclair/typebox'

export const MessageTextCreate = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 2000 })
})

export const MessageListParameters = Type.Object({
  cursor: Type.Optional(Type.Integer()),
  orderBy: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number({ default: 20, minimum: 1, maximum: 100 }))
})

export const MessageResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  userId: Type.String({ format: 'uuid' }),
  type: Type.Union([Type.Literal('text'), Type.Literal('file')]),
  content: Type.Optional(Type.String()),
  fileName: Type.Optional(Type.String()),
  filePath: Type.Optional(Type.String({ format: 'uri' })),
  fileMimeType: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' })
})

export type MessageTextCreateType = Static<typeof MessageTextCreate>
export type MessageListParametersType = Static<typeof MessageListParameters>
export type MessageResponseType = Static<typeof MessageResponse>
