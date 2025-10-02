# Travel Journal (tra-tra)

A full-stack travel journal application for logging and revisiting memories from your trips. The project uses a React + Vite front-end, an Express/Node.js back-end powered by Drizzle ORM and PostgreSQL, and Docker for easy local development.

## Features

- 🔐 **Authentication** – secure registration, login, and logout with hashed passwords and JWT stored in HTTP-only cookies.
- 👥 **Multi-user support** – each traveler has a private journal with profile customization.
- 🗺️ **Interactive map** – click anywhere in the world to log a visit, auto-filling the city/country when available via OpenStreetMap.
- 🏙️ **Visited locations list** – browse previously saved entries grouped by country and city.
- 📝 **Journal entries** – capture descriptions, visit dates, companions, ratings, and more.
- 🙋 **Profile management** – update your display name, avatar, and bio.

## Project structure

```
.
├── backend             # Express API, Drizzle schema, authentication, and journal endpoints
├── frontend            # React/Vite client with map UI and journal experience
├── docker-compose.yml  # Local stack (Postgres, API, client)
└── README.md
```

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tra-tra.git
cd tra-tra
```

### 2. Configure environment variables

Copy the example environment files and adjust the values to your needs:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Make sure to update `JWT_SECRET` in the backend `.env` for production-grade security. You can tweak the `VITE_API_URL` in the front-end env file when deploying.

### 3. Run with Docker (recommended)

```bash
docker compose up --build
```

The services will be available at:

- Front-end: http://localhost:5173
- API: http://localhost:4000
- PostgreSQL: `postgres://postgres:postgres@localhost:5432/tratra`

On the first run, generate the database schema with Drizzle:

```bash
docker compose exec backend npm run migrate
```

### 4. Run manually (without Docker)

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Make sure PostgreSQL is running locally and that `DATABASE_URL` points to the correct instance.

## Database schema overview

The Drizzle ORM schema lives in `backend/src/db/schema.ts` and defines two tables:

- `users` – stores account details (`email`, `passwordHash`, `fullName`, optional `avatarUrl`/`bio`).
- `journal_entries` – stores per-user visit logs with location coordinates, descriptions, dates, and optional notes.

## API endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/api/auth/register`  | Register a new account               |
| POST   | `/api/auth/login`     | Authenticate and receive a session   |
| POST   | `/api/auth/logout`    | Clear the current session cookie     |
| GET    | `/api/auth/me`        | Retrieve the authenticated user      |
| GET    | `/api/profile`        | Get the logged-in user's profile     |
| PUT    | `/api/profile`        | Update profile information           |
| GET    | `/api/journal`        | List all journal entries + countries |
| POST   | `/api/journal`        | Create a new journal entry           |
| PUT    | `/api/journal/:id`    | Update an existing entry             |
| DELETE | `/api/journal/:id`    | Remove an entry                      |

All journal and profile routes require authentication. JWTs are issued during login/registration and stored in an HTTP-only cookie for security.

## Front-end highlights

- Built with Vite + React + TypeScript for a fast dev experience.
- Authentication context handles login state, initialization, and logout.
- Zustand store keeps map state, selected entries, and pending form data in sync.
- React Leaflet renders markers for each visit and lets travelers click anywhere to start a new entry.
- Responsive layout adapts from desktop split-view to mobile stacking.

## Deployment notes

- Replace the default JWT secret and review CORS origins before deploying.
- Configure HTTPS in production so authentication cookies remain secure.
- The map uses OpenStreetMap tiles and a reverse-geocoding request to Nominatim; review their usage policy for production workloads.

## Additional ideas

- Add photo uploads via an object storage service (S3, Cloudinary, etc.).
- Provide collaborative journals that can be shared with travel buddies.
- Implement advanced filters (date ranges, tags, mood) and analytics.
- Create offline support for logging trips without connectivity.

Enjoy logging your adventures! ✈️🌍
