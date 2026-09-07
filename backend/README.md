# FIZZ-CONNECT - Backend API

Production-ready backend service architecture for **FIZZ-CONNECT**, built with Node.js and Express.js.

---

## 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/             # Application configuration, environment variables, database config
│   │   ├── database.js     # PostgreSQL configuration placeholder
│   │   └── env.js          # Environment variable loader
│   │
│   ├── controllers/        # Thin request/response handlers
│   │   ├── health.controller.js
│   │   └── index.js
│   │
│   ├── services/           # Business logic layer
│   │   ├── health.service.js
│   │   └── index.js
│   │
│   ├── routes/             # REST API route definitions
│   │   ├── health.routes.js
│   │   └── index.js
│   │
│   ├── middleware/         # Security, error handling, validation, not found handlers
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   └── index.js
│   │
│   ├── validators/         # Request schema validation (Joi/Zod/express-validator)
│   │   └── index.js
│   │
│   ├── utils/              # Reusable helper utilities
│   │   ├── response.js
│   │   └── index.js
│   │
│   ├── models/             # Database access and models (PostgreSQL)
│   │   └── index.js
│   │
│   ├── app.js              # Express app setup and middleware configuration
│   └── server.js           # Server entry point
│
├── tests/
│   ├── unit/               # Isolated unit tests
│   │   └── health.service.test.js
│   └── integration/        # Endpoint and integration tests
│       └── health.test.js
│
├── .env.example            # Template for environment variables
├── eslint.config.js        # ESLint flat configuration
├── package.json            # Scripts and dependencies
└── README.md               # Backend documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18+` or higher
- **npm**: `v9+` or higher

### Installation

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Default configuration variables:
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `5000` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | (placeholder) |
| `JWT_SECRET` | Secret key for JWT verification | (placeholder) |

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with live-reloading via Nodemon |
| `npm start` | Starts server in production mode |
| `npm test` | Executes Jest test suite (unit and integration tests) |
| `npm run lint` | Runs ESLint to check code quality and formatting |

---

## 📡 Base Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health-check endpoint verifying API server status |

---

## 🛡️ Security & Architecture Best Practices

- **Separation of Concerns**: Strict boundary between Routes, Controllers, Services, and Models.
- **Security Middleware**: Configured with `helmet` for HTTP headers and `cors` for cross-origin access.
- **Standardized Responses**: Predictable JSON response payloads across success and error states.
- **Centralized Error Handling**: Uncaught errors caught by structured Express error middleware without crashing the runtime.
- **Testing Architecture**: Modular unit and integration test setups using Jest and Supertest.
