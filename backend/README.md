# FIZZ-CONNECT - Backend API

Production-ready backend service architecture for **FIZZ-CONNECT**, built with Node.js, Express.js, and PostgreSQL.

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/             # Application configuration, environment variables, PostgreSQL pool
│   │   ├── database.js     # PostgreSQL connection pool with parameterized queries
│   │   └── env.js          # Environment variable loader and defaults
│   │
│   ├── controllers/        # Thin request/response handlers
│   │   ├── auth.controller.js
│   │   ├── health.controller.js
│   │   └── index.js
│   │
│   ├── services/           # Business logic layer
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── health.service.js
│   │   └── index.js
│   │
│   ├── routes/             # REST API route definitions
│   │   ├── auth.routes.js
│   │   ├── health.routes.js
│   │   └── index.js
│   │
│   ├── middleware/         # Security, auth, error handling, validation handlers
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   ├── notFoundHandler.js
│   │   ├── validate.js
│   │   └── index.js
│   │
│   ├── validators/         # Input validation schemas & sanitizer functions
│   │   ├── auth.validator.js
│   │   └── index.js
│   │
│   ├── utils/              # Reusable helper utilities
│   │   ├── crypto.js       # Bcrypt, JWT, and crypto token hashing helpers
│   │   ├── response.js     # Standardized JSON response helpers
│   │   └── index.js
│   │
│   ├── models/             # Database access and models (PostgreSQL)
│   │   ├── user.model.js
│   │   ├── passwordResetToken.model.js
│   │   └── index.js
│   │
│   ├── app.js              # Express app setup and middleware configuration
│   └── server.js           # Server entry point
│
├── tests/
│   ├── unit/               # Isolated unit tests
│   │   ├── auth.service.test.js
│   │   ├── auth.validator.test.js
│   │   ├── crypto.util.test.js
│   │   └── health.service.test.js
│   └── integration/        # Endpoint and integration tests
│       ├── auth.test.js
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
- **PostgreSQL**: `v14+` or higher

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

Environment Configuration:
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `5000` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:password@localhost:5432/fizz_connect` |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | *(secure secret)* |
| `JWT_EXPIRES_IN` | Standard token expiration | `24h` |
| `JWT_REMEMBER_EXPIRES_IN`| Extended token expiration when rememberMe is true | `7d` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |
| `RESET_PASSWORD_URL` | Reset password page URL | `http://localhost:5173/reset-password` |
| `SMTP_HOST` | SMTP server host (optional in dev) | `""` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `""` |
| `SMTP_PASSWORD` | SMTP password | `""` |
| `EMAIL_FROM` | Sender email address | `no-reply@fizzconnect.com` |

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with live-reloading via Nodemon |
| `npm start` | Starts server in production mode |
| `npm test` | Executes Jest test suite (unit and integration tests) |
| `npm run lint` | Runs ESLint to check code quality and formatting |

---

## 📡 API Endpoints

### 1. Health Check
- **`GET /api/health`**
  - **Description**: Verifies API health and uptime.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "FIZZ-CONNECT API is running",
      "data": {
        "status": "ok",
        "service": "FIZZ-CONNECT Backend API",
        "uptime": 12.34,
        "timestamp": "2026-09-08T11:45:00.000Z"
      }
    }
    ```

### 2. User Registration
- **`POST /api/auth/register`**
  - **Description**: Registers a new user and returns authenticated JWT token.
  - **Request Body**:
    ```json
    {
      "fullName": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "confirmPassword": "password123"
    }
    ```
  - **Response (201)**:
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - **Error (409)**:
    ```json
    {
      "success": false,
      "message": "An account with this email already exists"
    }
    ```

### 3. User Login
- **`POST /api/auth/login`**
  - **Description**: Authenticates user credentials and issues a JWT token.
  - **Request Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123",
      "rememberMe": true
    }
    ```
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    }
    ```
  - **Error (401)**:
    ```json
    {
      "success": false,
      "message": "Invalid email or password"
    }
    ```

### 4. Forgot Password
- **`POST /api/auth/forgot-password`**
  - **Description**: Generates a secure one-time reset token and sends an email link.
  - **Security**: Always returns a generic response to prevent email enumeration.
  - **Request Body**:
    ```json
    {
      "email": "john@example.com"
    }
    ```
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "If an account exists for this email, a password reset link has been sent."
    }
    ```

### 5. Reset Password
- **`POST /api/auth/reset-password`**
  - **Description**: Resets the password using a valid raw token received from the reset link.
  - **Request Body**:
    ```json
    {
      "token": "raw-reset-token-from-url",
      "newPassword": "newpassword123",
      "confirmPassword": "newpassword123"
    }
    ```
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Password has been successfully reset"
    }
    ```
  - **Error (400)**:
    ```json
    {
      "success": false,
      "message": "Invalid or expired password reset token"
    }
    ```

### 6. Current Authenticated User (Protected)
- **`GET /api/auth/me`**
  - **Description**: Returns the authenticated user's profile.
  - **Headers**: `Authorization: Bearer <token>`
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "User profile retrieved",
      "data": {
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "createdAt": "2026-09-08T11:00:00.000Z",
          "updatedAt": "2026-09-08T11:00:00.000Z"
        }
      }
    }
    ```
  - **Error (401)**:
    ```json
    {
      "success": false,
      "message": "Authorization header missing"
    }
    ```

---

## 🛡️ Security & Architecture Best Practices

- **Layered Architecture**: Strict separation between Routes → Controllers → Services → Models → PostgreSQL.
- **SQL Injection Prevention**: 100% parameterized queries via `pg.Pool`.
- **Password Security**: Salted password hashing with `bcrypt` (10 rounds). Plain text passwords are never stored or logged.
- **Token Security**: One-time use reset tokens hashed with SHA-256 in the database. Raw tokens are never stored.
- **Authentication**: JWT tokens signed with HMAC SHA-256 (`JWT_SECRET`).
- **HTTP Security**: `helmet` headers, `cors` cross-origin control, and sanitized error responses (no stack traces in production).
- **Email Enumeration Defense**: Identical generic responses for forgot-password requests regardless of account existence.
