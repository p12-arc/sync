# TaskFlow | Production-Ready Task Management System

![TaskFlow Landing Page](https://raw.githubusercontent.com/p12-arc/sync/main/public/header.png)

A comprehensive, full-stack Task Management Application designed for the **Developer Technical Assessment**. Built with focused attention on **Security Architecture**, **Clean Code**, and **Production Deployment**.

---

## 🚀 Live Links
- **Live Application**: [*(Enter Vercel URL here)*](https://sync-p12.vercel.app)
- **GitHub Repository**: [https://github.com/p12-arc/sync.git](https://github.com/p12-arc/sync.git)

---

## 🏗️ Architecture & Tech Stack

The application follows a **Monolithic Monorepo** architecture using **Next.js 14** (App Router) for both the high-performance Frontend and the unified Backend API.

| Layer | Technology |
|---|---|
| **Frontend** | React 18 / Next.js 14 / Tailwind CSS (Glassmorphism UI) |
| **Backend** | Next.js API Routes (Node.js Runtime) |
| **Database** | MongoDB Atlas (NoSQL) with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) with HTTP-only Cookies |
| **Validation** | Zod (Schema-based runtime validation) |
| **Security** | AES-256-GCM Encryption / bcrypt / Helmet-compliant headers |

---

## 🔐 Security Standards (Advanced Implementation)

This project prioritizes security far beyond basic CRUD requirements:

1.  **JWT-Based Auth**: Tokens are stored in **HttpOnly, Secure, and SameSite=Strict** cookies to prevent XSS and CSRF attacks.
2.  **Sensitive Data Encryption**: The `description` field of every task is encrypted with **AES-256-GCM** before being stored in MongoDB. Even with full database access, task details remain unreadable without the `AES_SECRET_KEY`.
3.  **Password Security**: Uses **bcryptjs** with a cost factor of **12** to ensure computationally expensive hashing.
4.  **Route Protection**: Implements **Edge-compatible Middleware** (`jose`) to intercept and validate sessions before pages are even rendered.
5.  **SQL/NoSQL Injection Prevention**: All queries pass through **Mongoose ODM** with strict schema validation.
6.  **Input Validation**: Every API request is validated against **Zod schemas** to ensure zero-malformed data ingestion.

---

## 📦 Core Features

### 1. User Management
- **Secure Registration**: Real-time validation for email/password strength.
- **Persistent Sessions**: Seamless login with 7-day token rotation.
- **Smart Redirects**: Automatically routes users between landing, login, and dashboard pages based on auth state.

### 2. Task Management (CRUD)
- **Status Workflow**: Filter tasks by `To Do`, `In Progress`, and `Done`.
- **Search Engine**: Title-based search with debounced input for performance.
- **Pagination**: Efficiently handles infinite tasks with server-side pagination (9 per page).
- **Ownership Lockdown**: Users can **only** access or modify tasks they created.

---

## 🛠️ Local Setup Guide

### 1. Prerequisites
- Node.js 18.x or higher
- pnpm (recommended) or npm
- A MongoDB Atlas Cluster URI

### 2. Installation
```bash
git clone https://github.com/p12-arc/sync.git
cd sync
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_32_char_secret
AES_SECRET_KEY=your_64_char_hex_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Tip**: Generate a 32-byte hex key for `AES_SECRET_KEY` using:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Run Development
```bash
pnpm dev
```

---

## 📡 API Documentation (Sample Reference)

### **Auth: User Login**
- **Method**: `POST /api/auth/login`
- **Payload**: `{ "email": "user@example.com", "password": "secure123" }`
- **Success (200)**: Sets `tm_token` cookie and returns user object.

### **Tasks: Get All (Filtered)**
- **Method**: `GET /api/tasks?status=in-progress&search=design&page=1`
- **Success (200)**: Returns paginated tasks and metadata.

### **Tasks: Create Task**
- **Method**: `POST /api/tasks`
- **Payload**: `{ "title": "Buy groceries", "description": "Milk, Eggs, Bread", "status": "todo" }`
- **Note**: `description` is automatically AES-encrypted on the server before DB write.

### **Health Check**
- **Method**: `GET /api/health`
- **Returns**: `{"status": "healthy", "database": "connected"}`

---

## 📄 License & Assessment Note
Project completed within the 24-hour challenge window.
Built by **[Your Name/p12-arc]** for the Full Stack Technical Assessment.
