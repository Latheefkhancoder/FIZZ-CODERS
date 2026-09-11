# FIZZ-CONNECT - Complete Backend API

Production-ready backend service architecture for **FIZZ-CONNECT**, built with Node.js and Express.js to power all frontend features: **Boards, Members, Tasks, Comments, Activity Logs, Team Chat, Profile, and Authentication**.

---

## 📁 Architecture & Directory Structure

```text
backend/
├── src/
│   ├── config/             # Configuration & environment variables
│   │   ├── env.js          # Environment loader
│   │   └── database.js     # Embedded database configuration
│   │
│   ├── repositories/       # Isolated persistence layer (prepared for Firestore)
│   │   ├── memoryStore.js  # Clean in-memory Map collections (no synthetic data)
│   │   ├── user.repository.js
│   │   ├── board.repository.js
│   │   ├── member.repository.js
│   │   ├── task.repository.js
│   │   ├── comment.repository.js
│   │   ├── activity.repository.js
│   │   ├── chat.repository.js
│   │   └── index.js
│   │
│   ├── services/           # Core business logic & authorization rules
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── health.service.js
│   │   ├── board.service.js
│   │   ├── member.service.js
│   │   ├── task.service.js
│   │   ├── comment.service.js
│   │   ├── activity.service.js
│   │   ├── chat.service.js
│   │   ├── profile.service.js
│   │   └── index.js
│   │
│   ├── controllers/        # Thin request/response handlers
│   │   ├── auth.controller.js
│   │   ├── health.controller.js
│   │   ├── board.controller.js
│   │   ├── member.controller.js
│   │   ├── task.controller.js
│   │   ├── comment.controller.js
│   │   ├── activity.controller.js
│   │   ├── chat.controller.js
│   │   ├── profile.controller.js
│   │   └── index.js
│   │
│   ├── routes/             # REST API route declarations & mounting
│   │   ├── index.js
│   │   ├── health.routes.js
│   │   ├── auth.routes.js
│   │   ├── board.routes.js
│   │   ├── member.routes.js
│   │   ├── task.routes.js
│   │   ├── comment.routes.js
│   │   ├── activity.routes.js
│   │   ├── chat.routes.js
│   │   └── profile.routes.js
│   │
│   ├── middleware/         # Security, JWT auth, board authorization, validation
│   │   ├── auth.middleware.js # Extracts and verifies Bearer JWT
│   │   ├── authorize.js       # requireBoardAccess and requireBoardAdmin
│   │   ├── validate.js        # Input validation middleware factory
│   │   ├── errorHandler.js    # Centralized JSON error handler
│   │   ├── notFoundHandler.js # 404 handler
│   │   └── index.js
│   │
│   ├── validators/         # Input validation rules
│   │   ├── auth.validator.js
│   │   ├── board.validator.js
│   │   ├── member.validator.js
│   │   ├── task.validator.js
│   │   ├── comment.validator.js
│   │   ├── chat.validator.js
│   │   ├── profile.validator.js
│   │   └── index.js
│   │
│   ├── utils/              # Reusable crypto and response helpers
│   │   ├── crypto.js
│   │   ├── response.js
│   │   └── index.js
│   │
│   ├── models/             # Auth models
│   │   ├── user.model.js
│   │   ├── emailVerification.model.js
│   │   ├── passwordResetToken.model.js
│   │   └── index.js
│   │
│   ├── app.js              # Express app setup and middleware pipeline
│   └── server.js           # Server bootstrap
│
├── tests/
│   ├── unit/               # Isolated unit tests
│   │   ├── auth.service.test.js
│   │   ├── auth.validator.test.js
│   │   ├── board.service.test.js
│   │   ├── crypto.util.test.js
│   │   ├── health.service.test.js
│   │   ├── member.service.test.js
│   │   └── task.service.test.js
│   │
│   └── integration/        # End-to-end API integration tests
│       ├── activity.test.js
│       ├── auth.test.js
│       ├── board.test.js
│       ├── chat.test.js
│       ├── comment.test.js
│       ├── health.test.js
│       ├── member.test.js
│       ├── profile.test.js
│       └── task.test.js
│
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18+` or higher
- **npm**: `v9+` or higher

### Installation
```bash
cd backend
npm install
```

### Running Locally
```bash
# Start backend in development mode with nodemon:
npm run dev

# Run test suite:
npm test
```

---

## 🔒 Security & Authorization Architecture

1. **Source of Truth for Identity**: The verified JWT payload (`req.user.id`, `req.user.name`, `req.user.email`) is the sole identity source of truth. Any `ownerId`, `authorId`, or arbitrary user IDs submitted in the request body are disregarded.
2. **Board Access Control (`requireBoardAccess`)**:
   - For all board-scoped requests, the middleware confirms whether `req.user.id` is the board creator or an active board member.
   - Unauthorized attempts return `403 Forbidden`.
3. **Board Admin Privileges (`requireBoardAdmin`)**:
   - Destructive actions (deleting boards, adding/removing members, altering roles) require the user to be the board owner or hold the `'Admin'` role on that board.
4. **Data Privacy**: No user can access or modify another board's tasks, comments, chat messages, or activity logs simply by changing the `boardId` or `taskId` parameter.

---

## 📡 REST API Reference

### Response Format
All endpoints return standard JSON responses:

**Success**:
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific validation or domain error"]
}
```

---

### 1. Health
- `GET /api/health` — Returns API service status and uptime.

### 2. Authentication (Preserved & Tested)
- `POST /api/auth/register` — Registers user, triggers email OTP.
- `POST /api/auth/verify-email` — Verifies 6-digit OTP.
- `POST /api/auth/resend-verification` — Issues fresh OTP.
- `POST /api/auth/login` — Issues Bearer JWT token.
- `POST /api/auth/forgot-password` — Generates secure reset token.
- `GET  /api/auth/verify-reset-token` — Validates reset token.
- `POST /api/auth/reset-password` — Sets new password.
- `GET  /api/auth/me` — Authenticated user details.

### 3. Board Management
- `POST /api/boards`
  - Body: `{ "name": "Sprint Board", "code": "A7K2P" }`
  - Code: exactly 5 alphanumeric characters (A-Z, 0-9), normalized to uppercase.
  - Automatically associates creator as owner and Admin member.
  - Generates activity log.
- `GET /api/boards`
  - Lists all boards accessible to the authenticated user. Returns empty array `[]` if none exist.
- `GET /api/boards/:boardId`
  - Board details (requires board access).
- `DELETE /api/boards/:boardId`
  - Deletes board and cascades cleanup of tasks, members, comments, activity logs, and chat messages.
- `GET /api/boards/code/:code`
  - Previews public board metadata before joining.
- `POST /api/boards/join`
  - Body: `{ "code": "A7K2P" }`
  - Enrolls authenticated user as a `'Member'` on the target board.
  - Prevents duplicate joins.

### 4. Board Members
- `GET /api/boards/:boardId/members`
  - Lists members of the board.
- `POST /api/boards/:boardId/members`
  - Body: `{ "email": "user@example.com", "role": "Member" }`
  - Validates user exists in system (no fake users).
  - Role: `'Admin'` or `'Member'`.
- `PATCH /api/boards/:boardId/members/:userId`
  - Body: `{ "role": "Admin" }`
  - Modifies member role (owner role cannot be modified).
- `DELETE /api/boards/:boardId/members/:userId`
  - Removes member from board (owner cannot be removed).

### 5. Tasks
- `POST /api/boards/:boardId/tasks`
  - Body: `{ "title": "...", "description": "...", "priority": "HIGH", "assignee": "userId", "dueDate": "YYYY-MM-DD" }`
  - Priorities: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  - Status defaults to `TODO`.
  - Assignee must belong to the board.
  - Logs creation and assignment activities.
- `GET /api/boards/:boardId/tasks`
  - Retrieves board tasks. Supports query filters: `?status=...&priority=...&search=...`.
- `GET /api/tasks/my`
  - Returns tasks assigned to the authenticated user across accessible boards.
- `GET /api/tasks/:taskId`
  - Retrieves task details including comments.
- `PATCH /api/tasks/:taskId`
  - Updates title, description, priority, assignee, or dueDate.
- `PATCH /api/tasks/:taskId/status`
  - Body: `{ "status": "IN_PROGRESS" }`
  - Allowed: `TODO`, `IN_PROGRESS`, `DONE` (normalizes `IN PROGRESS`).
- `DELETE /api/tasks/:taskId`
  - Deletes task and associated comments.

### 6. Comments
- `GET /api/tasks/:taskId/comments`
  - Returns comments for task.
- `POST /api/tasks/:taskId/comments`
  - Body: `{ "text": "..." }`
  - Sets author from JWT identity.
  - Records activity log.

### 7. Activity Logs
- `GET /api/boards/:boardId/activity-logs`
  - Returns audit trail of actions (`who`, `what`, `when`, `action`, `description`).
  - Sorted newest first.

### 8. Team Chat
- `GET /api/boards/:boardId/chat`
  - Returns chat messages for board.
- `POST /api/boards/:boardId/chat`
  - Body: `{ "text": "..." }`
  - Sends team message.

### 9. Profile
- `GET /api/profile`
  - Returns current user profile (`id`, `name`, `email`, `role`, `bio`, `initials`).
- `PATCH /api/profile`
  - Body: `{ "name": "...", "bio": "..." }`
  - Updates user name and biography safely.

---

## 🔄 Replacing In-Memory Persistence with Firebase/Firestore

The data layer in `src/repositories/` is fully isolated and adheres to async document-based signatures:
- `board.repository.js`
- `member.repository.js`
- `task.repository.js`
- `comment.repository.js`
- `activity.repository.js`
- `chat.repository.js`
- `user.repository.js`

> **Detailed Handoff Guide**: For complete Firestore collection schemas, compound indexes, input/output contracts for every method, and code samples, see [FIREBASE_HANDOFF.md](./FIREBASE_HANDOFF.md).

To integrate Firebase/Firestore in the future:
1. Configure Firebase Admin SDK in `src/config/firebase.js`.
2. Swap the internal Map operations inside `src/repositories/*.js` with Firestore collection references:
   ```javascript
   // Example for board.repository.js:
   const db = require("../config/firebase");
   async create(boardData) {
     const docRef = await db.collection("boards").add(boardData);
     return { id: docRef.id, ...boardData };
   }
   ```
3. Update `src/repositories/index.js` to re-export the Firestore repositories.
4. Zero changes will be needed in any Controller, Service, Validator, or Route.

