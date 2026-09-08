# Fizz Connect — Frontend

A **production-level React + Vite** frontend for the Fizz Connect collaborative workspace platform.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Axios](https://axios-http.com) | HTTP client |
| CSS Modules | Scoped component styles |

---

## Project Structure

```
frontend/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, icons, fonts
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route-level page components
│   ├── layouts/              # Shared layout shells (MainLayout, AuthLayout)
│   ├── routes/               # AppRoutes + ProtectedRoute guard
│   ├── services/             # Axios API calls (apiClient, authService, boardService)
│   ├── hooks/                # Custom React hooks (useAsync, useLocalStorage)
│   ├── context/              # React Context providers (AuthContext)
│   ├── utils/                # Constants & helper functions
│   ├── styles/               # Global CSS design system tokens
│   ├── App.jsx               # Root component – providers only, no business logic
│   └── main.jsx              # Vite entry point
├── .env.example              # Required environment variable template
├── index.html                # HTML shell with SEO meta & Inter font
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
```

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Routing Structure

| Path | Page | Access |
|---|---|---|
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage | 🔒 Auth required |
| `/board/:id` | BoardPage | 🔒 Auth required |
| `*` | NotFoundPage (404) | Public |

---

## API Services

All API calls are routed through `src/services/apiClient.js` which is a pre-configured Axios instance that:

- Sets the base URL from `VITE_API_BASE_URL`
- Attaches `Authorization: Bearer <token>` on every request
- Redirects to `/login` on `401 Unauthorized`
- Normalises error messages for easy consumption

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application display name | `Fizz Connect` |

> **Note:** All Vite env variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.

---

## Design System

The global design system lives in `src/styles/global.css` and exposes CSS custom properties for:

- **Colors** – primary, secondary, surface, text tokens
- **Spacing** – consistent `--space-*` scale
- **Typography** – Inter font, size scale
- **Shadows** – `--shadow-sm/md/lg`
- **Transitions** – `--transition-fast/base/slow`
- **Border radii** – `--radius-sm/md/lg/xl/full`

---

## Contributing

1. Branch from `main`
2. Follow the folder structure above
3. Keep pages thin — business logic belongs in hooks, services, or context
4. Use CSS Modules for all component styles

---

*Built with ❤️ by the Fizz Coders team.*
