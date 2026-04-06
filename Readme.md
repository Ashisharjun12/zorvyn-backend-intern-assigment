# Finance Backend: Assignment Submission 🚀

Hi! This is my project for the Backend Developer Intern Assignment at Zorvyn. I've built a modular, scalable finance management API that handles everything from tracking transactions to complex role-based access control (RBAC). 

My main goal here was to create something that isn't just a "CRUD app" but a solid foundation that could actually scale in the real world.

---

## The Architecture: "Modular Monolith"

Instead of a messy "everything-in-one-folder" approach or over-engineering with microservices too early, I went with a **Modular Monolith**. 

### Why I chose this:
- **Logical Separation**: I've split the code into self-contained modules (Auth, Users, Records, Dashboard). This makes the code way easier to navigate.
- **Ready for Microservices**: If this project ever needs to scale into separate services, it's already 90% there because the boundaries are clearly defined.
- **Clean Code**: Each module has its own logic, interfaces, and routes. No more spaghetti code!

### Database Schema
This is how the data is structured. I've kept it normalized and efficient for the finance use case.

![Database Schema](https://ik.imagekit.io/aevhlnk0h/Screenshot%202026-04-06%20185141.png)

---

##  My Tech Stack

I didn't just pick random tools; I chose these for build speed and type safety:

- **Runtime**: Node.js with **TypeScript** (Strict mode turned on, obviously).
- **Framework**: **Express.js** — because it's lightweight and I know exactly what's happening under the hood.
- **Database**: **PostgreSQL** hosted on **Supabase**.
- **ORM**: **Drizzle ORM**. Honestly, I prefer it over Prisma because it's much faster and feels more like writing actual SQL.
- **Validation**: **Zod**. Every single request is validated before it even hits the controller.
- **Testing**: **Vitest**. Super fast, way better than Jest for modern ESM projects.
- **Logging**: **Pino**. Because console.log is for amateurs; Pino gives me structured, high-performance JSON logs.
- **Security**: **Express Rate Limit** & **Helmet**. Essential for protecting the API from brute force and common web vulnerabilities.
- **Docs**: **Swagger/OpenAPI**. Good documentation is as important as the code.

---

## Technical Decisions & "Why I did this"

- **Why Drivel over Prisma?** Prisma is great, but its engine is heavy. I wanted something that stays close to SQL and is lightweight for serverless/containerized environments. Drizzle hits that sweet spot.
- **Security Strategy**: I've implemented **Express Rate Limit** on all public routes to prevent abuse. Combine that with **Helmet** and **BCryptJS** for password hashing, and the API is pretty solid.
- **Structured Logging**: I chose **Pino** because it's the fastest logger in the Node.js ecosystem. In a production environment, having JSON logs makes debugging with tools like CloudWatch or ELK a breeze.
- **CI/CD Logic**: I went with a dual deployment (AWS + DigitalOcean). AWS shows the "Enterprise" side (ECR/ECS), while DigitalOcean provides a fast, developer-friendly mirror for the live demo.

---

## What this project actually does

### 1. Security First (RBAC)
I've implemented a robust Role-Based Access Control system. It's not just a boolean check; I have a dedicated middleware that handles hierarchies:
- **Admin**: The "Superuser" who can do everything.
- **Analyst**: Can view data and insights but can't change the core system.
- **Viewer**: Read-only access to the dashboard.

### 2. Financial Logic
- Full CRUD for transactions (Income/Expense).
- Categorization and date tracking.
- **Soft Deletes**: When you delete a record, it's not gone forever (audit trail!), just marked as deleted.

### 3. Analytics Engine
I didn't just return raw data. The dashboard API computes:
- Total income/expenses and net balance.
- Spending by category.
- Monthly trends (great for charts).

---

## How the code is organized

I've kept `src/` very clean using a modular structure:

```text
src/
├── config/
│   ├── database.ts          # Drizzle + pg connection
│   └── env.ts               # Zod env validation
├── modules/                 # Self-contained business domains
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts   # Zod request schemas
│   │   └── auth.interface.ts 
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.routes.ts
│   │   ├── user.schema.ts
│   │   └── user.interface.ts
│   ├── records/
│   │   ├── record.controller.ts
│   │   ├── record.service.ts
│   │   ├── record.repository.ts
│   │   ├── record.routes.ts
│   │   ├── record.schema.ts
│   │   └── record.interface.ts
│   └── dashboard/
│       ├── dashboard.controller.ts
│       ├── dashboard.service.ts
│       ├── dashboard.routes.ts
│       └── dashboard.interface.ts
├── db/
│   ├── schema.ts            # Drizzle table definitions
│   └── migrations/          # Auto-generated by drizzle-kit
├── middlewares/
│   ├── auth.middleware.ts   # JWT verify
│   ├── rbac.middleware.ts   # Role guard factory
│   ├── validate.middleware.ts
│   └── error.middleware.ts
├── utils/
│   ├── ApiError.ts          # Custom error class
│   ├── ApiResponse.ts       # Unified response wrapper
│   ├── logger.ts            # Pino logger
│   └── hash.ts              # Bcrypt helpers
├── types/
│   └── express.d.ts         # User augmentation for Request
├── __test__/                # Centralized Testing
│   ├── unit/                # Unit tests for services/utils
│   └── integrations/        # Integration tests for API endpoints
├── app.ts                   # Express app setup
├── server.ts                # Entry point
└── swagger.yaml             # Generated OpenAPI 3.0 spec
```

---

## 🧪 Testing Strategy

I'm a big believer in automated testing. You can't ship without it.
- **Unit Tests**: Testing my services and logic in isolation.
- **Integration Tests**: Running the full API against a **live Supabase test instance** to ensure the database layer works.

**Run them yourself:**
- `pnpm install`
- `pnpm run test`

---

## 🚀 API Endpoints Overview

The API follows a consistent RESTful pattern. All protected endpoints require a Bearer Token in the `Authorization` header.

###  Role Access Key
| Role | Description |
| :--- | :--- |
| **Public** | No authentication required |
| **All** | Any authenticated user (Viewer, Analyst, Admin) |
| **A/A** | Admin and Analyst only |
| **Admin** | Admin only |

###  Authentication Module
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | **Public** |
| `POST` | `/auth/login` | Authenticate & get JWT | **Public** |

###  User Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | List all system users | **Admin** |
| `GET` | `/users/:id` | Get specific user details | **All** |
| `PATCH` | `/users/:id` | Update user profile data | **All** |
| `PATCH` | `/users/:id/role` | Change a user's role | **Admin** |
| `PATCH` | `/users/:id/status` | Change account status | **Admin** |
| `DELETE` | `/users/:id` | Soft delete a user | **Admin** |

###  Financial Records
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/records` | List records with filters | **A/A** |
| `POST` | `/records` | Create new financial entry | **Admin** |
| `GET` | `/records/:id` | Get single record details | **A/A** |
| `PATCH` | `/records/:id` | Update financial entry | **Admin** |
| `DELETE` | `/records/:id` | Soft delete a record | **Admin** |

###  Dashboard Analytics
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | Get analytical summary | **All** |

---

##  API Documentation

The API is fully documented using Swagger/OpenAPI 3.0.

- **Live Demo & API Docs**: [https://king-prawn-app-k6p4h.ondigitalocean.app/api/docs/#/](https://king-prawn-app-k6p4h.ondigitalocean.app/api/docs/#/)
- **Local Dev UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

##  Deployment & CI/CD

### AWS (Primary)
Fully automated pipeline via **GitHub Actions**:
1. **Lint/Test**: Validates code quality and logic.
2. **Push to ECR**: Builds and tags Docker image.
3. **Deploy to ECS**: Updates services in the Fargate cluster.

### DigitalOcean (Recommended for Demo)
Live deployment utilizing student credits.
- **Repository Fork**: [ashudev21/zorvyn](https://github.com/ashudev21)
- **Live Link**: [View Live Deployment](https://king-prawn-app-k6p4h.ondigitalocean.app/api/docs/#/)
- **Health Status**: [Server Health Check](https://king-prawn-app-k6p4h.ondigitalocean.app/api/health)

---

**Developed by Ashish Kumar** | [LinkedIn](https://www.linkedin.com/in/ashish-raj-300943188/) | [portifilio website](https://www.ashishdev.online/)