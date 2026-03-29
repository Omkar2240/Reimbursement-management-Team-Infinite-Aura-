# Reimbursement Odoo (FlowExpense)

## Introduction

This repository contains a full-stack expense reimbursement platform with role-based workflows:

- **Super Admin** manages Admin accounts
- **Admin** signs up and configures organization workflows
- **Manager** approves/rejects team expenses
- **Employee** submits and tracks expenses

Core capabilities include:

- Authentication and profile management
- Admin user/team management (manager-employee mapping)
- Expense submission and history
- Sequential and conditional approval rules
- Currency conversion for expense amounts
- Receipt upload with OCR extraction placeholders

---

## Project Structure

```text
reimbursment-odoo/
├─ backend/    # Node.js + Express + Sequelize + PostgreSQL APIs
└─ frontend/   # Next.js + React + TypeScript UI
```

---

## Tech Stack

### Backend

- Node.js + Express
- Sequelize ORM + PostgreSQL
- JWT auth
- Express Validator
- Multer (receipt upload)

### Frontend

- Next.js (App Router)
- React + TypeScript
- TanStack Query
- React Hook Form + Zod
- Tailwind-based UI components

---

## API Base URL

All API routes are under:

```text
/api/v1
```

Examples:

- `POST /api/v1/user/sign-up`
- `POST /api/v1/admin/user/login`
- `GET /api/v1/expenses`
- `POST /api/v1/admin/sub-admin`

---

## Installation & Setup

## 1) Prerequisites

- Node.js `>= 20.12.1`
- npm (for frontend)
- pnpm (recommended for backend scripts)
- PostgreSQL database (local or cloud)

---

## 2) Clone and install

From repository root:

```bash
cd backend
pnpm install

cd ..\frontend
npm install
```

---

## 3) Environment variables

Create `backend/.env` with at least:

```env
NODE_ENV=development
PORT=4000
JWT_SECRET_KEY=your_jwt_secret
DEV_DATABASE_URL=postgresql://username:password@host:5432/dbname
TEST_DATABASE_URL=postgresql://username:password@host:5432/dbname_test
DATABASE_URL=postgresql://username:password@host:5432/dbname_prod

BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
DEFAULT_CURRENCY_CODE=USD
CDN_WEB_STATIC=http://localhost:4000
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 4) Run database migrations/seeders

From `backend`:

```bash
pnpm run migrate:up
pnpm run seed:up
```

> If you see `Error parsing url: undefined`, verify `DEV_DATABASE_URL` is set in `backend/.env`.

---

## 5) Start applications

### Backend

```bash
cd backend
pnpm start
```

Backend runs on `http://localhost:4000` (by default).

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## Validation Commands

### Frontend

```bash
npm run lint
npm run build
```

### Backend

```bash
pnpm run lint
```

---

## Architecture

## High-Level Flow

1. Admin signs up (public signup endpoint).
2. Admin account is created and linked to company context.
3. Admin creates managers/employees and assigns manager relationships.
4. Employee submits expense.
5. Expense moves through approval chain.
6. Approvers approve/reject in sequence until final state.

---

## Backend Architecture

The backend follows layered responsibilities:

- **Routes**: `backend/routes/...`  
  Maps endpoints and middleware.

- **Controllers**: `backend/controllers/...`  
  Handles request/response and error mapping.

- **Repositories**: `backend/models/repositories/...`  
  Core business logic and DB operations.

- **Models**: `backend/models/...`  
  Sequelize models and associations.

- **Schema validation**: `backend/schema-validation/...`  
  Request payload validation with express-validator.

### Important domain entities

- `User`
- `Company`
- `Expense`
- `ApprovalRule`
- `ExpenseApproval`
- `AccessManagement`

### Core repository modules

- `UserRepository`
- `SubAdminRepository`
- `ExpenseRepository`
- `ApprovalRuleRepository`
- `CompanyRepository`

---

## Frontend Architecture

Frontend uses feature-based organization:

- `src/app/` for Next.js routes/layouts
- `src/features/` for feature UI modules
- `src/hooks/` for React Query hooks
- `src/services/` for API clients
- `src/schemas/` for Zod form schemas
- `src/providers/` for auth/query providers

### Important frontend modules

- Auth:
  - login/signup UI
  - token handling
  - profile fetch
  - role-based redirects
- Admin:
  - sub-admin management
  - manager relationship mapping
  - rules builder
- Expenses:
  - submit expenses
  - pending approvals
  - approval chain visualization
  - conversion + receipt upload

---

## Key Workflows

## Role model

1. `SUPER_ADMIN`  
   Manages admin accounts.

2. `ADMIN`  
   Can sign up and manage managers/employees/rules.

3. `MANAGER` / `EMPLOYEE`  
   Created by Admin through Team Management.

## Expense approval

- Sequential step-based approvals
- Optional manager approver rule
- Optional percentage threshold rule
- Optional CFO shortcut rule

---

## Common Issues & Troubleshooting

## 1) Login says user does not exist

- Confirm correct endpoint flow and role.
- Check email case/whitespace.
- Verify user row `status` is not deleted/blocked.

## 2) Migrations fail with database URL errors

- Ensure `DEV_DATABASE_URL` is present in backend `.env`.

## 3) Team dropdowns empty in manager assignment

- Ensure backend returns role fields from sub-admin listing.
- Refresh page after backend restart and re-login.

## 4) Add Rule button disabled

- Ensure admin profile has valid `companyId`.
- Fill valid step and threshold values.

---

## Development Notes

- API docs are available at `/api-docs` in non-production mode.
- Health check endpoint: `/health`
- Keep backend and frontend running with matching env values.

