# DevPulse API

## Live Link

https://your-api-url.com

## Features

- Authentication
- JWT Authorization
- Issue Tracking
- Role Based Access
- Status Workflow

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Neon DB
- JWT
- bcrypt

## Setup

npm install

npm run dev

## Environment Variables

DATABASE_URL=
JWT_SECRET=
PORT=

## API Endpoints

POST /api/auth/signup
POST /api/auth/login

POST /api/issues
GET /api/issues
GET /api/issues/:id
PATCH /api/issues/:id
PATCH /api/issues/:id/status
DELETE /api/issues/:id