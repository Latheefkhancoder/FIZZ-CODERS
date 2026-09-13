# FIZZ-CONNECT

> A multi-tenant collaborative team task management platform.

FIZZ-CONNECT is a team collaboration and task management application that
allows users to create workspaces, manage team members, create Kanban boards,
assign tasks, collaborate through comments, and track activities.

---

## 🚀 Project Overview

FIZZ-CONNECT provides:

- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Multi-tenant workspaces
- Admin and Member roles
- Role-Based Access Control (RBAC)
- Workspace member management
- Kanban boards
- TODO / IN PROGRESS / DONE columns
- Task creation and assignment
- Task priorities and due dates
- Drag-and-drop task management
- Task comments
- Activity logs
- Search and filtering
- REST APIs
- Database (Firebase/Firestore integration pending.)
- Automated testing
- CI/CD
- Deployment

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Backend | Node.js + Express.js |
| Database | Firebase/Firestore integration pending. |
| Authentication | JWT |
| Password Security | bcrypt |
| API | REST API |
| Testing | Jest / Supertest |
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions |
| Containerization | Docker |

---

## 📁 Project Structure

```text
collabboard/
│
├── frontend/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/                  # Node.js + Express.js backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── .gitignore
├── .env.example
└── README.md