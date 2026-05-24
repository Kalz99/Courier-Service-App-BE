# ⚡ ShipSync - Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js version" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express version" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript version" />
  <img src="https://img.shields.io/badge/PostgreSQL-16.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL version" />
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod version" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT status" />
</p>

<p align="center">
  <strong>A scalable RESTful API backend for managing courier shipments, tracking history and role-based logistics operations.</strong><br />
  Built with TypeScript, Express.js and PostgreSQL using a clean layered architecture and raw SQL queries.
</p>

---

# 📖 Table of Contents

* [Core Features](#-core-features)
* [Technology Stack](#-technology-stack)
* [Dependencies & Packages](#-dependencies--packages)
* [Project Structure](#-project-structure)
* [Database Schema](#-database-schema)
* [API Endpoints](#-api-endpoints)
* [Setup Guide](#-setup-guide)
* [Environment Variables](#-environment-variables)
* [Authentication Flow](#-authentication-flow)
* [Architecture Notes](#-architecture-notes)

---

# 🚀 Core Features

* 🔐 JWT Authentication with Access Tokens and Refresh Tokens
* 🛡️ Role-Based Access Control (RBAC) for `customer` and `admin`
* 📦 Shipment creation and shipment tracking
* 📜 Shipment status history auditing
* ✅ Request validation using Zod schemas
* 📈 Admin analytics and shipment statistics
* 🚨 Centralized global error handling
* ⚡ React Query friendly API architecture

---

# 🛠️ Technology Stack

| Layer             | Technology         |
| :---------------- | :----------------- |
| Runtime           | Node.js            |
| Backend Framework | Express.js 5       |
| Language          | TypeScript         |
| Database          | PostgreSQL         |
| Database Driver   | pg (node-postgres) |
| Validation        | Zod                |
| Authentication    | JWT + bcrypt       |
| API Style         | REST API           |

---

# 📦 Dependencies & Packages

Here is a breakdown of all backend dependencies configured in [`package.json`](file:///d:/Github/Courier-Service-App/backend/package.json):

### Core Dependencies

* **`express`** (`^5.2.1`): Web application framework for routing, requests, responses, and middleware pipeline.
* **`pg`** (`^8.21.0`): Non-blocking PostgreSQL client for Node.js. Used to interface directly with the database.
* **`cors`** (`^2.8.6`): Express middleware to enable Cross-Origin Resource Sharing (CORS).
* **`cookie-parser`** (`^1.4.7`): Cookie parsing middleware used to handle HTTP-only cookies (e.g. for refresh tokens).
* **`jsonwebtoken`** (`^9.0.3`): Implementation of JSON Web Tokens for secure authentication and authorization.
* **`bcrypt`** (`^6.0.0`): A library for hashing passwords, ensuring user password security in the database.
* **`zod`** (`^4.4.3`): TypeScript-first schema declaration and validation library to validate incoming API request bodies and query parameters.
* **`dotenv`** (`^17.4.2`): Loads environment variables from a `.env` file into `process.env`.

### Development Dependencies

* **`typescript`** (`^6.0.3`): TypeScript language support and compiler.
* **`tsx`** (`^4.22.3`): TypeScript Execute. Used to watch and run typescript files directly (`tsx watch`) during development.
* **`ts-node-dev`** (`^2.0.0`): Restarts target node process when any of the required files change.
* **Type definitions** (`@types/*`): TypeScript declarations for type safety across all libraries (`@types/node`, `@types/express`, `@types/pg`, `@types/cors`, `@types/cookie-parser`, `@types/jsonwebtoken`, `@types/bcrypt`).

---

# 📁 Project Structure

```txt
backend/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── jwt.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── customer.controller.ts
│   │   └── shipment.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── repository/
│   │   ├── admin.repository.ts
│   │   ├── customer.repository.ts
│   │   ├── shipment.repository.ts
│   │   └── shipmentTracking.repository.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── customer.routes.ts
│   │   └── shipment.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── admin.service.ts
│   │   ├── customer.service.ts
│   │   └── shipment.service.ts
│   │
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   └── shipment.validation.ts
│   │
│   ├── types/
│   ├── utils/
│   └── server.ts
│
├── package.json
└── tsconfig.json
```

---

# 🗄️ Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        varchar name
        varchar email UK
        varchar password
        text address
        varchar business_name
        varchar phone_number
        varchar role
        text refresh_token
        timestamp created_at
    }

    shipments {
        uuid id PK
        varchar tracking_number UK
        varchar recipient_name
        text recipient_address
        varchar recipient_phone_number
        varchar shipment_type
        numeric weight
        varchar status
        uuid user_id FK
        timestamp created_at
    }

    shipment_status_history {
        uuid id PK
        uuid shipment_id FK
        varchar status
        uuid updated_by FK
        timestamp created_at
    }

    users ||--o{ shipments : places
    shipments ||--o{ shipment_status_history : tracks
    users ||--o{ shipment_status_history : updates
```

---

# 🔌 API Endpoints

> [!NOTE]
> **API Mounting Note:**
> In [`server.ts`](file:///d:/Github/Courier-Service-App/backend/src/server.ts), routes are mounted with both specific prefixes (`/api/shipments`, `/api/admin`) and general API prefixes (`/api`). This means the shipment and admin endpoints can be queried using either URL style (e.g., `/api/admin/get-shipment` or `/api/get-shipment`).

## 🩺 System Check — `/` (Root)

| Method | Endpoint | Description | Access |
| :----- | :------- | :---------- | :----- |
| GET    | `/`      | Database Connection & Server Health Check (Returns DB local time) | Public |

---

## 🔑 Authentication — `/api/auth`

| Method | Endpoint    | Description               | Access |
| :----- | :---------- | :------------------------ | :----- |
| POST   | `/register` | Register new user         | Public |
| POST   | `/login`    | Login user                | Public |
| POST   | `/refresh`  | Generate new access token | Public (Requires Refresh Cookie) |
| POST   | `/logout`   | Logout user               | Public |

---

## 📦 Shipment Routes — `/api/shipments` (also mounted at `/api`)

| Method | Endpoint                | Description | Access |
| :----- | :---------------------- | :---------- | :----- |
| POST   | `/create-shipment`      | Creates a new shipment | Customer |
| GET    | `/get-my-shipment`      | Retrieves shipments belonging to current customer | Customer |
| GET    | `/get-my-status-counts` | Retrieves status counts for customer's shipments | Customer |
| GET    | `/search-shipment`      | Searches a shipment by tracking number | Customer |
| GET    | `/track-shipment`       | Tracks a shipment chronologically (no auth required) | Public |

---

## 🛡️ Admin Routes — `/api/admin` (also mounted at `/api`)

| Method | Endpoint                      | Description | Access |
| :----- | :---------------------------- | :---------- | :----- |
| GET    | `/get-shipment`               | Retrieves all shipments (paginated) | Admin |
| PATCH  | `/update-shipment/:id/status` | Updates shipment status & appends to status history | Admin |
| GET    | `/get-status-counts`          | Retrieves global status counts of all shipments | Admin |
| GET    | `/get-customers`              | Retrieves list of all customers (paginated) | Admin |
| GET    | `/get-top-customers`          | Retrieves top customers by shipment count | Admin |

---

# ⚙️ Setup Guide

## Prerequisites

* Node.js v22+
* PostgreSQL v16+
* npm

---

## 1. Clone Repository

```bash
git clone https://github.com/Kalz99/Courier-Service-App-BE.git
cd Courier-Service-App-BE
```

---

## 2. Install Dependencies

The backend project has multiple runtime and development dependencies. You can install all of them at once (standard installation), or manually choose to install production and development dependencies separately.

### Option A: Standard Installation (Recommended)

Run the following command from the `backend` folder to install all dependencies specified in `package.json`:

```bash
npm install
```

### Option B: Individual Installations

If you prefer to install the packages manually or need to rebuild the environment, use the following commands:

#### 1. Core Production Dependencies
```bash
npm install express pg cors cookie-parser jsonwebtoken bcrypt zod dotenv
```

#### 2. Development & Type Definitions
```bash
npm install -D typescript tsx ts-node-dev @types/node @types/express @types/pg @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcrypt
```

---

## 3. Create PostgreSQL Database

Open PostgreSQL shell:

```bash
psql -U postgres
```

Create database:

```sql
CREATE DATABASE courier_app_db;
```

Exit shell:

```sql
\q
```

---

## 4. Import Database Schema

```bash
psql -U postgres -d courier_app_db -f ../database/schema.sql
```

---

## 5. Configure Environment Variables

Create `.env` file inside backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=courier_app_db

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

---

## 6. Start Development Server

```bash
npm run dev
```

Backend server runs on:

```txt
http://localhost:5000
```

---

# 📊 Environment Variables

| Variable           | Description              |
| :----------------- | :----------------------- |
| PORT               | Express server port      |
| DB_HOST            | PostgreSQL host          |
| DB_PORT            | PostgreSQL port          |
| DB_USER            | PostgreSQL username      |
| DB_PASSWORD        | PostgreSQL password      |
| DB_NAME            | PostgreSQL database name |
| JWT_SECRET         | JWT access token secret  |
| JWT_REFRESH_SECRET | JWT refresh token secret |
| JWT_EXPIRY         | Access token expiry      |
| JWT_REFRESH_EXPIRY | Refresh token expiry     |

---

# 🔒 Authentication Flow

```txt
Client
   │
   ├── Login Request
   │
   ▼
Backend API
   │
   ├── Validate Credentials
   ├── Generate Access Token
   ├── Generate Refresh Token
   │
   ▼
Client Receives:
   ├── Access Token (Response Body)
   └── Refresh Token (HttpOnly Cookie)

Protected Routes:
Authorization: Bearer <token>
```

---

# 🏛️ Architecture Notes

## Layered Architecture

The backend follows a layered architecture structure:

* Routes → API endpoint definitions
* Controllers → Request handling
* Services → Business logic
* Repository → Raw SQL database queries
* Middleware → Authentication, validation, and error handling

---

## Raw SQL Approach

Raw SQL queries were used instead of an ORM to:

* Keep query control simple
* Improve SQL learning and debugging
* Reduce unnecessary abstraction layers
* Optimize query performance

---

## Validation Strategy

Zod validation middleware is used to:

* Validate incoming requests
* Keep controllers clean
* Return consistent validation errors
* Improve API reliability

---

## Error Handling

The application uses:

* Centralized global error middleware
* Custom `AppError` class
* Consistent JSON error responses

---

# 👨‍💻 Development Notes

This application was built focusing on:

* Clean architecture
* Type safety
* Scalable backend structure
* Authentication & authorization
* API performance
* Maintainable code practices
