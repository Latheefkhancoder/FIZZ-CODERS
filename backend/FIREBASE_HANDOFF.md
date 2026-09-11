# FIZZ-CONNECT — Firebase/Firestore Integration Handoff Guide

This guide is designed for the Firebase/Firestore engineer tasked with replacing the development in-memory repository layer with a production Google Cloud Firestore backend.

---

## 1. Architectural Boundary & Guiding Rules

The backend strictly follows a decoupled, layered architecture:

```
HTTP Request
     ↓
Middleware (authenticate, authorize, validate)
     ↓
Controllers (board.controller.js, task.controller.js, etc.)
     ↓
Services (board.service.js, task.service.js, etc.)
     ↓
[ REPOSITORY BOUNDARY ]
     ↓
Repository Interface / Implementation
     ├── Currently: In-Memory Map Store (memoryStore.js)
     └── Target:    Firebase / Cloud Firestore
```

### Strict Non-Negotiable Rules
1. **Zero Changes Above Repositories**:
   - Do **NOT** modify any controller in `src/controllers/`.
   - Do **NOT** modify any business service in `src/services/`.
   - Do **NOT** modify routes in `src/routes/`.
   - Do **NOT** modify middleware in `src/middleware/`.
   - Do **NOT** modify validators in `src/validators/`.
   - Do **NOT** change API response formats (`{ success: true, message, data }`).
2. **Services Must Never Access Firestore Directly**:
   - Controllers and services only ever call repository methods (e.g. `await boardRepository.create(...)`).
   - No `firebase-admin`, `@google-cloud/firestore`, or Firestore `DocumentReference`/`QuerySnapshot` types should ever leak into services or controllers.
3. **Async Method Signatures**:
   - Every repository method returns a Promise resolving to plain JavaScript objects or arrays of plain objects (with string `id`s, strings, numbers, booleans, and ISO-8601 date strings).
4. **Preserve Authentication**:
   - Authentication remains functional as-is. All user identities come from verified JWTs (`req.user.id`, `req.user.name`, `req.user.email`).

---

## 2. Firestore Collection Architecture & Data Models

We recommend a flat collection layout with document IDs and index fields, as this simplifies compound queries, pagination, and multi-board queries.

### Collection 1: `users`
Represents registered users and profile metadata.

**Document ID**: User ID (string)

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | User ID | Yes | `"usr_101"` |
| `name` | `string` | Full name | Yes | `"Arun Kumar"` |
| `email` | `string` | Unique email (lowercase) | Yes | `"arun@gmail.com"` |
| `role` | `string` | Global role (`"Admin"` or `"Member"`) | Yes | `"Member"` |
| `bio` | `string` | User biography | No | `"Full stack developer"` |
| `createdAt` | `string` (ISO) | Registration timestamp | Yes | `"2026-09-08T10:00:00.000Z"` |
| `updatedAt` | `string` (ISO) | Last update timestamp | Yes | `"2026-09-08T11:00:00.000Z"` |

**Indexes**:
- Single-field index on `email` (Ascending) for fast login/search.

---

### Collection 2: `boards`
Represents workspaces created by users.

**Document ID**: Auto-generated string (e.g., Firestore auto-ID or `board_<timestamp>_<rand>`)

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Unique Board ID | Yes | `"board_1726056789_a7b2"` |
| `name` | `string` | Display name of board | Yes | `"Sprint 1 Board"` |
| `code` | `string` | Exactly 5 chars, uppercase, alphanumeric | Yes | `"A7K2P"` |
| `ownerId` | `string` | User ID of board creator | Yes | `"usr_101"` |
| `createdAt` | `string` (ISO) | Creation timestamp | Yes | `"2026-09-08T10:00:00.000Z"` |
| `updatedAt` | `string` (ISO) | Last update timestamp | Yes | `"2026-09-08T10:00:00.000Z"` |

**Indexes**:
- Single-field unique index on `code` (Ascending).
- Compound index on `ownerId` (Ascending) + `createdAt` (Descending).

---

### Collection 3: `boardMembers`
Links users to boards and stores their board-specific role.

**Document ID**: Auto-generated string or compound `${boardId}_${userId}`

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Membership ID | Yes | `"member_1726056789_x9y1"` |
| `boardId` | `string` | Target Board ID | Yes | `"board_1726056789_a7b2"` |
| `userId` | `string` | User ID | Yes | `"usr_102"` |
| `name` | `string` | Member display name | Yes | `"Priya Sharma"` |
| `email` | `string` | Member email | Yes | `"priya@gmail.com"` |
| `role` | `string` | Board role: `"Admin"` or `"Member"` | Yes | `"Member"` |
| `initials` | `string` | 1-2 uppercase letters | Yes | `"P"` |
| `joinedAt` | `string` (ISO) | Enrollment timestamp | Yes | `"2026-09-08T10:05:00.000Z"` |

**Indexes**:
- Compound index on `boardId` (Ascending) + `userId` (Ascending).
- Single-field index on `userId` (Ascending) to query user's memberships.

---

### Collection 4: `tasks`
Tasks belonging to a board.

**Document ID**: Auto-generated string

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Task ID | Yes | `"task_1726056789_m4k2"` |
| `boardId` | `string` | Target Board ID | Yes | `"board_1726056789_a7b2"` |
| `title` | `string` | Task title | Yes | `"Design Login Page"` |
| `description` | `string` | Detailed task description | No | `"Responsive form with validation"` |
| `priority` | `string` | `"LOW"`, `"MEDIUM"`, `"HIGH"`, `"URGENT"` | Yes | `"HIGH"` |
| `status` | `string` | `"TODO"`, `"IN_PROGRESS"`, `"DONE"` | Yes | `"TODO"` |
| `creatorId` | `string` | Creator's User ID | Yes | `"usr_101"` |
| `creator` | `string` | Creator display name | Yes | `"Arun"` |
| `assignee` | `string` or `null` | Assigned member's User ID | No | `"usr_102"` |
| `dueDate` | `string` or `null` | Due date (`"YYYY-MM-DD"`) | No | `"2026-09-20"` |
| `createdAt` | `string` (ISO) | Creation timestamp | Yes | `"2026-09-08T10:10:00.000Z"` |
| `updatedAt` | `string` (ISO) | Last update timestamp | Yes | `"2026-09-08T10:10:00.000Z"` |

**Indexes**:
- Compound index on `boardId` (Ascending) + `createdAt` (Ascending).
- Compound index on `assignee` (Ascending) + `updatedAt` (Descending).
- Compound index on `boardId` (Ascending) + `status` (Ascending).
- Compound index on `boardId` (Ascending) + `priority` (Ascending).

---

### Collection 5: `comments`
Comments left by team members on specific tasks.

**Document ID**: Auto-generated string

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Comment ID | Yes | `"comment_1726056789_c1"` |
| `taskId` | `string` | Parent Task ID | Yes | `"task_1726056789_m4k2"` |
| `boardId` | `string` | Parent Board ID | Yes | `"board_1726056789_a7b2"` |
| `author` | `string` | Author display name | Yes | `"Priya"` |
| `authorId` | `string` | Author User ID | Yes | `"usr_102"` |
| `text` | `string` | Comment text content | Yes | `"Working on the validation logic now."` |
| `timestamp` | `string` (ISO) | Comment timestamp | Yes | `"2026-09-08T11:00:00.000Z"` |
| `createdAt` | `string` (ISO) | Creation timestamp | Yes | `"2026-09-08T11:00:00.000Z"` |

**Indexes**:
- Compound index on `taskId` (Ascending) + `createdAt` (Ascending).
- Single-field index on `boardId` (Ascending) for cascade deletions.

---

### Collection 6: `activityLogs`
Audit trail of actions performed on a board.

**Document ID**: Auto-generated string

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Activity Log ID | Yes | `"act_1726056789_a1"` |
| `boardId` | `string` | Target Board ID | Yes | `"board_1726056789_a7b2"` |
| `userId` | `string` | Actor User ID | Yes | `"usr_101"` |
| `who` | `string` | Actor display name | Yes | `"Arun"` |
| `what` | `string` | Human-readable action description | Yes | `"created task \"Design Login Page\""` |
| `action` | `string` | Action code | Yes | `"TASK_CREATED"` |
| `description` | `string` | Detailed action description | No | `"created task \"Design Login Page\""` |
| `when` | `string` (ISO) | Event timestamp | Yes | `"2026-09-08T10:10:00.000Z"` |
| `createdAt` | `string` (ISO) | Creation timestamp | Yes | `"2026-09-08T10:10:00.000Z"` |

**Indexes**:
- Compound index on `boardId` (Ascending) + `createdAt` (Descending).

---

### Collection 7: `chatMessages`
Team chat messages posted on a board.

**Document ID**: Auto-generated string

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | Chat Message ID | Yes | `"ch_1726056789_m1"` |
| `boardId` | `string` | Target Board ID | Yes | `"board_1726056789_a7b2"` |
| `author` | `string` | Sender display name | Yes | `"Arun"` |
| `authorId` | `string` | Sender User ID | Yes | `"usr_101"` |
| `text` | `string` | Message content | Yes | `"Hey team! Let's sync tomorrow."` |
| `timestamp` | `string` (ISO) | Sent timestamp | Yes | `"2026-09-08T10:15:00.000Z"` |
| `createdAt` | `string` (ISO) | Creation timestamp | Yes | `"2026-09-08T10:15:00.000Z"` |

**Indexes**:
- Compound index on `boardId` (Ascending) + `timestamp` (Ascending).

---

## 3. Comprehensive Repository Method Specifications

Below is the exact contract for every method in each repository. Your Firestore implementation **must** match these exact names, argument shapes, and return types.

---

### `board.repository.js`
File: [`src/repositories/board.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/board.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    name: string,      // e.g. "Sprint 1 Board"
    code: string,      // normalized 5-char uppercase string, e.g. "A7K2P"
    ownerId: string    // e.g. "usr_101"
  }
  ```
- **Output**: `Promise<BoardObject>`
  ```javascript
  {
    id: string,
    name: string,
    code: string,
    ownerId: string,
    createdAt: string, // ISO-8601
    updatedAt: string  // ISO-8601
  }
  ```
- **Firestore Equivalent**:
  ```javascript
  const docRef = await db.collection("boards").add({
    name,
    code: code.toUpperCase(),
    ownerId: String(ownerId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
  ```

#### 2. `findById(id)`
- **Input**: `id: string`
- **Output**: `Promise<BoardObject | null>`
- **Firestore Equivalent**:
  ```javascript
  const doc = await db.collection("boards").doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
  ```

#### 3. `findByCode(code)`
- **Input**: `code: string` (e.g. `"A7K2P"`)
- **Output**: `Promise<BoardObject | null>`
- **Firestore Equivalent**:
  ```javascript
  const snapshot = await db.collection("boards")
    .where("code", "==", code.trim().toUpperCase())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
  ```

#### 4. `findUserBoards(userId, memberBoardIds)`
- **Input**:
  - `userId: string`
  - `memberBoardIds: Set<string>` (Board IDs where user is enrolled as a member)
- **Output**: `Promise<Array<BoardObject>>` (Sorted descending by `createdAt`)
- **Firestore Equivalent**:
  ```javascript
  // Combine boards where ownerId == userId and boards in memberBoardIds
  // Filter and sort by createdAt descending
  ```

#### 5. `findAll()`
- **Input**: None
- **Output**: `Promise<Array<BoardObject>>`
- **Firestore Equivalent**:
  ```javascript
  const snapshot = await db.collection("boards").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  ```

#### 6. `delete(id)`
- **Input**: `id: string`
- **Output**: `Promise<boolean>`
- **Firestore Equivalent**:
  ```javascript
  await db.collection("boards").doc(id).delete();
  return true;
  ```

---

### `member.repository.js`
File: [`src/repositories/member.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/member.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    boardId: string,
    userId: string,
    name: string,
    email: string,
    role: "Admin" | "Member" // Defaults to "Member"
  }
  ```
- **Output**: `Promise<MemberObject>`
  ```javascript
  {
    id: string,
    boardId: string,
    userId: string,
    name: string,
    email: string,
    role: string,
    initials: string,
    joinedAt: string // ISO-8601
  }
  ```

#### 2. `findByBoardAndUser(boardId, userId)`
- **Input**: `boardId: string`, `userId: string`
- **Output**: `Promise<MemberObject | null>`

#### 3. `findById(id)`
- **Input**: `id: string`
- **Output**: `Promise<MemberObject | null>`

#### 4. `findByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<Array<MemberObject>>` (Sorted ascending by `joinedAt`)

#### 5. `findUserBoardIds(userId)`
- **Input**: `userId: string`
- **Output**: `Promise<Set<string>>` (Returns a `Set` of board IDs the user belongs to)

#### 6. `updateRole(boardId, userId, role)`
- **Input**: `boardId: string`, `userId: string`, `role: "Admin" | "Member"`
- **Output**: `Promise<MemberObject | null>`

#### 7. `delete(boardId, userId)`
- **Input**: `boardId: string`, `userId: string`
- **Output**: `Promise<boolean>`

#### 8. `deleteByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<number>` (Count of deleted member records)

---

### `task.repository.js`
File: [`src/repositories/task.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/task.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    boardId: string,
    title: string,
    description?: string,
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    status?: "TODO" | "IN_PROGRESS" | "DONE",
    creatorId: string,
    creatorName: string,
    assignee?: string | null,
    dueDate?: string | null
  }
  ```
- **Output**: `Promise<TaskObject>`
  ```javascript
  {
    id: string,
    boardId: string,
    title: string,
    description: string,
    priority: string,
    status: string,
    creatorId: string,
    creator: string,
    assignee: string | null,
    dueDate: string | null,
    createdAt: string,
    updatedAt: string,
    comments: []
  }
  ```

#### 2. `findById(id)`
- **Input**: `id: string`
- **Output**: `Promise<TaskObject | null>`

#### 3. `findByBoardId(boardId, filters)`
- **Input**:
  - `boardId: string`
  - `filters?: { status?: string, priority?: string, search?: string }`
- **Output**: `Promise<Array<TaskObject>>` (Sorted ascending by `createdAt`)

#### 4. `findByAssigneeId(userId, accessibleBoardIds)`
- **Input**:
  - `userId: string`
  - `accessibleBoardIds?: Set<string> | null`
- **Output**: `Promise<Array<TaskObject>>` (Sorted descending by `updatedAt`)

#### 5. `update(id, updates)`
- **Input**:
  - `id: string`
  - `updates: object` (e.g. `{ title, description, priority, status, assignee, dueDate }`)
- **Output**: `Promise<TaskObject | null>`

#### 6. `delete(id)`
- **Input**: `id: string`
- **Output**: `Promise<boolean>`

#### 7. `deleteByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<number>` (Count of deleted tasks)

---

### `comment.repository.js`
File: [`src/repositories/comment.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/comment.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    taskId: string,
    boardId: string,
    author: string,
    authorId: string,
    text: string
  }
  ```
- **Output**: `Promise<CommentObject>`
  ```javascript
  {
    id: string,
    taskId: string,
    boardId: string,
    author: string,
    authorId: string,
    text: string,
    timestamp: string, // ISO-8601
    createdAt: string  // ISO-8601
  }
  ```

#### 2. `findByTaskId(taskId)`
- **Input**: `taskId: string`
- **Output**: `Promise<Array<CommentObject>>` (Sorted ascending by `createdAt`)

#### 3. `deleteByTaskId(taskId)`
- **Input**: `taskId: string`
- **Output**: `Promise<number>`

#### 4. `deleteByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<number>`

---

### `activity.repository.js`
File: [`src/repositories/activity.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/activity.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    boardId: string,
    userId: string,
    who: string,
    what: string,
    action?: string,
    description?: string | null
  }
  ```
- **Output**: `Promise<ActivityLogObject>`
  ```javascript
  {
    id: string,
    boardId: string,
    userId: string,
    who: string,
    what: string,
    action: string,
    description: string,
    when: string,      // ISO-8601
    createdAt: string // ISO-8601
  }
  ```

#### 2. `findByBoardId(boardId, limit)`
- **Input**: `boardId: string`, `limit?: number` (default `100`)
- **Output**: `Promise<Array<ActivityLogObject>>` (Sorted descending by `createdAt`, newest first)

#### 3. `deleteByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<number>`

---

### `chat.repository.js`
File: [`src/repositories/chat.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/chat.repository.js)

#### 1. `create(params)`
- **Input**:
  ```javascript
  {
    boardId: string,
    author: string,
    authorId: string,
    text: string
  }
  ```
- **Output**: `Promise<ChatMessageObject>`
  ```javascript
  {
    id: string,
    boardId: string,
    author: string,
    authorId: string,
    text: string,
    timestamp: string, // ISO-8601
    createdAt: string  // ISO-8601
  }
  ```

#### 2. `findByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<Array<ChatMessageObject>>` (Sorted ascending by `timestamp`)

#### 3. `deleteByBoardId(boardId)`
- **Input**: `boardId: string`
- **Output**: `Promise<number>`

---

### `user.repository.js`
File: [`src/repositories/user.repository.js`](file:///c:/Users/rihan/OneDrive/Desktop/FIZZ%20CODER.MINI/FIZZ-CODERS/backend/src/repositories/user.repository.js)

#### 1. `findById(id)`
- **Input**: `id: string | number`
- **Output**: `Promise<UserObject | null>`
  ```javascript
  {
    id: string,
    name: string,
    email: string,
    role: string,
    bio: string,
    createdAt: string
  }
  ```

#### 2. `findByEmail(email)`
- **Input**: `email: string`
- **Output**: `Promise<UserObject | null>`

#### 3. `updateProfile(userId, updates)`
- **Input**: `userId: string | number`, `updates: { name?: string, bio?: string }`
- **Output**: `Promise<UserProfileObject>`
  ```javascript
  {
    id: string,
    name: string,
    email: string,
    role: string,
    bio: string,
    initials: string,
    updatedAt: string
  }
  ```

---

## 4. Step-by-Step Implementation Procedure for Firebase Developer

1. **Install Firebase Admin SDK**:
   ```bash
   cd backend
   npm install firebase-admin
   ```

2. **Initialize Firebase Admin in `src/config/firebase.js`**:
   ```javascript
   const admin = require("firebase-admin");
   const env = require("./env");

   if (!admin.apps.length) {
     admin.initializeApp({
       credential: admin.credential.cert({
         projectId: env.FIREBASE_PROJECT_ID,
         clientEmail: env.FIREBASE_CLIENT_EMAIL,
         privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
       }),
     });
   }

   const db = admin.firestore();
   module.exports = { admin, db };
   ```

3. **Implement Firestore Repositories**:
   Create a new folder or replace the files in `src/repositories/`:
   - `src/repositories/firestore/board.firestore.repository.js`
   - `src/repositories/firestore/member.firestore.repository.js`
   - `src/repositories/firestore/task.firestore.repository.js`
   - `src/repositories/firestore/comment.firestore.repository.js`
   - `src/repositories/firestore/activity.firestore.repository.js`
   - `src/repositories/firestore/chat.firestore.repository.js`
   - `src/repositories/firestore/user.firestore.repository.js`

4. **Update `src/repositories/index.js`**:
   Simply point the exports in `src/repositories/index.js` to your Firestore implementations:
   ```javascript
   // Change from in-memory to firestore:
   module.exports = {
     userRepository: require("./firestore/user.firestore.repository"),
     boardRepository: require("./firestore/board.firestore.repository"),
     memberRepository: require("./firestore/member.firestore.repository"),
     taskRepository: require("./firestore/task.firestore.repository"),
     commentRepository: require("./firestore/comment.firestore.repository"),
     activityRepository: require("./firestore/activity.firestore.repository"),
     chatRepository: require("./firestore/chat.firestore.repository"),
   };
   ```

5. **Run the Test Suite to Validate Compatibility**:
   ```bash
   npm test
   ```
   If all 16 test suites (99 tests) pass, your Firestore integration is 100% compliant with the backend and frontend contracts!
