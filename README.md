# TaskFlow — Task Management Application

A production-ready full-stack Task Management Application built with Next.js 14, MongoDB, JWT authentication, and AES-256-GCM encryption.

## Live Demo
- **Frontend + API**: Deployed on Vercel
- **GitHub**: [https://github.com/p12-arc/sync.git](https://github.com/p12-arc/sync.git)

## Architecture

```
Next.js 14 (App Router)
├── API Routes (backend)     → /src/app/api/**
├── Pages (frontend)         → /src/app/{login,register,dashboard}
├── Middleware               → /src/middleware.ts  (JWT route protection)
├── Mongoose Models          → /src/models/{User,Task}.ts
└── Lib Helpers              → /src/lib/{db,auth,crypto,validations}.ts

MongoDB Atlas (Database)
Vercel (Hosting)
```

## Security Features
- **bcrypt** (cost 12) password hashing
- **JWT** in `HttpOnly; Secure; SameSite=Strict` cookies (7-day TTL)
- **AES-256-GCM** encryption of task `description` field at rest
- **Zod** input validation on all API endpoints
- **Security headers**: X-Frame-Options, X-Content-Type-Options, XSS Protection
- Environment variables — no hardcoded secrets

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Local Development

```bash
# 1. Clone the repo
git clone <repo-url>
cd task-manager

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in: MONGODB_URI, JWT_SECRET, AES_SECRET_KEY

# 4. Run development server
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) |
| `AES_SECRET_KEY` | 64-char hex string (32 bytes for AES-256) |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL |

**Generate AES key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Documentation

### Auth

#### POST /api/auth/register
```json
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "securepass123" }

// Response 201
{ "message": "Registration successful", "user": { "id": "...", "name": "John Doe", "email": "john@example.com" } }

// Sets: Set-Cookie: tm_token=<jwt>; HttpOnly; Secure; SameSite=Strict
```

#### POST /api/auth/login
```json
// Request
{ "email": "john@example.com", "password": "securepass123" }

// Response 200
{ "message": "Login successful", "user": { "id": "...", "name": "John Doe", "email": "..." } }
```

#### POST /api/auth/logout
```json
// Response 200
{ "message": "Logged out successfully" }
// Clears the tm_token cookie
```

### Tasks

#### GET /api/tasks
Query params: `page=1&limit=10&status=all&search=keyword`
```json
// Response 200
{
  "tasks": [
    {
      "_id": "64abc...",
      "title": "Build landing page",
      "description": "Create responsive landing page",
      "status": "in-progress",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

#### POST /api/tasks
```json
// Request
{ "title": "New task", "description": "Details here", "status": "todo" }

// Response 201
{ "task": { "_id": "...", "title": "New task", "description": "Details here", "status": "todo", ... } }
```

#### PUT /api/tasks/:id
```json
// Request (any fields optional)
{ "title": "Updated title", "status": "done" }

// Response 200
{ "task": { ... updated task ... } }
```

#### DELETE /api/tasks/:id
```json
// Response 200
{ "message": "Task deleted successfully" }
```

### Error Responses
```json
// 400 Validation Error
{ "error": "Validation failed", "details": { "email": ["Invalid email address"] } }

// 401 Unauthorized
{ "error": "Unauthorized" }

// 403 Forbidden (other user's task)
{ "error": "Forbidden" }

// 404 Not Found
{ "error": "Task not found" }

// 409 Conflict
{ "error": "Email already registered" }

// 500 Server Error
{ "error": "Internal server error" }
```

## Deployment (Vercel)

1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy — Vercel auto-builds on every push

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes (Node.js runtime) |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + HTTP-only cookies |
| Encryption | AES-256-GCM (Node.js crypto) |
| Validation | Zod |
| UI Icons | Lucide React |
| Notifications | React Hot Toast |
