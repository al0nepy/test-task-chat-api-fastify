FROM node:lts-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:lts-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app /app

RUN mkdir uploads

ENV NODE_ENV=production

RUN chown -R appuser:appgroup /app

RUN chown -R appuser:appgroup /uploads

USER appuser

EXPOSE 3000

CMD ["node", "src/server.js"]
