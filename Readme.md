# CHAT REST API

## Overview

The Chat REST API endpoints:

Swagger url: `/api/docs`

* `api/account/login` - post
* `api/account/register` - post
* `api/message/text` - post
* `api/message/file` - post ```bash curl --location 'http://127.0.0.1:3000/api/message/file' \
--header 'Authorization: Basic dGVzdDp0ZXN0' \
--form 'file=@"path to file"'``` Not exists in Swagger
* `api/message/` - get (query params: limit, cursor(pagination))
* `api/message/content` get (query params: id)

## Getting Started

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/al0nepy/test-task-chat-api-fastify.git
   cd test-task-chat-api-fastify
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   * Copy `.env.example` to `.env` and fill in the required values.

4. **Create folder uploads if not exits**:
   * Root: ```bash mkdir uploads```

5. **Run the application**:

   * Using Node.js:

     ```bash
     npm run dev
     ```

## Scripts

* `npm run dev`: Run the development server.
* `npm run build`: Compiles TypeScript to JavaScript.
* `npm run lint`: Lints the codebase using ESLint.
* `npm run format`: Formats the codebase using Prettier.
* `npm run db:migrate`: Run migrations

## Docker Setup

To build and run the application using Docker:

```bash
docker compose up --build
```
