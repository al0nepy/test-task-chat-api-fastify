FROM node:lts-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:lts-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app /app

RUN mkdir -p /app/uploads && \
    chown -R appuser:appgroup /app/uploads && \
    chmod -R 755 /app/uploads

ENV NODE_ENV=production

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
