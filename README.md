# Friday - Personal Management System

A modular personal management system built with NestJS, Vite+React, and Prisma.

## Features

- 🔐 Authentication (JWT)
- 💰 Income & Expense tracking
- 📊 Dashboard with charts
- 🔌 OpenClaw API access
- 📱 Modular architecture

## Tech Stack

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** Vite + React + TypeScript + TailwindCSS
- **Deploy:** Vercel (frontend) + Render (backend)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `GET /auth/profile` - Get profile

### Transactions
- `POST /transactions/expense` - Add expense
- `GET /transactions/expenses` - List expenses
- `POST /transactions/income` - Add income
- `GET /transactions/incomes` - List incomes
- `GET /transactions/summary` - Get summary
- `GET /transactions/categories` - Expenses by category

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL="https://your-backend-url.com"
```
