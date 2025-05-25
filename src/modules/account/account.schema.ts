import { Type } from '@sinclair/typebox'

export const RegisterInput = Type.Object({
  login: Type.String({ maxLength: 255 }),
  password: Type.String({ minLength: 8, maxLength: 100 })
})

export const LoginInput = Type.Object({
  login: Type.String(),
  password: Type.String()
})

export type RegisterType = typeof RegisterInput
export type LoginType = typeof LoginInput
