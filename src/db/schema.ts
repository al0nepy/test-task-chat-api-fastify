import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  login: varchar('login', { length: 50 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  user: varchar('user'),
  type: text('type', { enum: ['text', 'file'] }).notNull(),
  content: text('content'),
  fileMimeType: text('file_mime_type'),
  fileName: text('file_name'),
  filePath: text('file_path'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
