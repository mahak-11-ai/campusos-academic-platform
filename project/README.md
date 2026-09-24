# CampusOS

A centralized academic resource and query platform connecting college students and teachers.

Built with the **MERN** stack: MongoDB, Express.js, React, Node.js.

## Features

- **Authentication** — JWT-based login/registration with bcrypt password hashing
- **Role-based access** — Separate student and teacher experiences
- **Student Dashboard** — Stats, quick links, recently uploaded resources
- **Teacher Dashboard** — Upload stats, resource management table
- **Subject Browsing** — Browse and create subjects, view resource counts
- **Resource Search** — Filter by subject, topic, resource type, and full-text search
- **Resource Upload** — File upload (PDF, DOC, PPT, etc.) or external URL
- **Resource Management** — Teachers can view and delete their uploads
- **Latest Resources** — See the most recently uploaded materials
- **AI Study Assistant** — Students ask questions; teachers answer them

## Project Structure

```
/
├── client (frontend — React + Vite)
│   └── src/
│       ├── components/    # Navbar, ResourceCard, ProtectedRoute, badges
│       ├── context/       # AuthContext
│       ├── pages/         # Landing, Login, Register, Dashboards, Browse, etc.
│       └── services/      # API layer (auth, subject, resource, question, dashboard)
│
├── server (backend — Express + MongoDB)
│   ├── config/            # DB connection, seed script
│   ├── controllers/       # auth, subject, resource, question, dashboard
│   ├── middleware/        # auth (JWT), error handler, upload (multer)
│   ├── models/            # User, Subject, Resource, Question (Mongoose)
│   └── routes/            # REST API routes
│
└── package.json           # Frontend dependencies
```

## Setup

### Backend

```bash
cd server
cp .env.example .env      # Fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # Starts on port 5000
```

To seed sample subjects:

```bash
node config/seed.js
```

### Frontend

```bash
cp .env.example .env      # Set VITE_API_URL to your backend URL
npm install
npm run dev               # Starts on port 5173
```

## Environment Variables

**Backend** (`server/.env`):
- `PORT` — Server port (default 5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `JWT_EXPIRES_IN` — Token expiry (default 7d)
- `CLIENT_URL` — Frontend URL for CORS

**Frontend** (`.env`):
- `VITE_API_URL` — Backend API URL (e.g. `http://localhost:5000/api`)

## Security

- Passwords hashed with bcrypt (never stored in plaintext)
- JWT tokens for authentication
- Role-based authorization middleware
- Environment variables for all secrets
- `.env` files excluded from git
