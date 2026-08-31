# PMS — Project Management SyncBoard

PMS is a complete real-time project and task management system built for the supplied group-project brief. It combines a responsive React workspace, a protected Express REST API, MongoDB persistence, JWT authentication, Socket.IO synchronization, offline task support, concurrent-edit protection, tests, CI, Docker, and deployment configuration.

## Demo access

| Portal | URL | Username | Password |
| --- | --- | --- | --- |
| Member workspace | `/login.html` | `login@pms` | `pms@123` |
| Administrator panel | `/admin-login.html` | `admin@login` | `admin@123` |

The application creates these accounts, a PMS implementation project, five specialist team members, and example tasks when it starts with an empty database. Change the demo passwords before exposing a production deployment.

## Completed functions

### Member workspace

- Login, refresh-session handling, protected routes, registration, profile editing, and logout
- Home overview with personal work, deadlines, team status, recent activity, and quick actions
- Dashboard with total, assigned, ongoing, done, overdue, average progress, priority, category, and personal-work charts
- Real-time Kanban board with Assigned, Ongoing, and Done stages and drag-and-drop movement
- Task list with search and status, priority, category, member, and project filters
- Add/edit/delete tasks with title, description, assignee, status, progress, priority, category, due date, tags, and comments
- Member cards with name, username, email, board role, project role, department, progress, online presence, and last seen time
- Member-to-member Contact workspace with persistent direct messages, help requests, unread counts, and real-time delivery
- Reports with project totals, member performance, detailed task records, and CSV export
- Live activity-based notifications and offline/synchronization notices
- Administrator request submission and decision history
- Settings for dark mode, compact mode, reduced motion, notification preferences, and desktop profile-photo upload
- Responsive layouts for desktop, tablet, and mobile

### Administrator panel

- Dedicated `/admin-login.html` entry point and separate administrator navigation
- Dashboard with account, board, task, completion, workflow, request, recent-activity totals, and a live vertical bar graph for progress analytics
- Project task list, full task editing, comments, deletion, and dedicated Add Task page
- Member/account management with role and active-state controls
- Create member accounts with an administrator-assigned username, password, role, department, and optional board access
- Passwords are stored as bcrypt hashes; members sign in through the normal username/password login
- Project reports and CSV export
- Request approval, rejection, response, and reopening
- Administrator settings and logout

### Platform and engineering

- React component-based client with reusable contexts, pages, forms, tables, modals, charts, and task components
- Express routes/controllers/models separation
- MongoDB persistence through Mongoose
- JWT access tokens and rotating HTTP-only refresh cookies
- Task snapshot cache, task-form drafts, and an ordered offline mutation queue in `localStorage`
- Optimistic concurrency through `revision`; stale changes return HTTP `409` with the newest task
- Socket.IO board/task/activity/presence delivery between connected clients
- Jest + React Testing Library client tests and Jest + Supertest server tests
- GitHub Actions CI with a MongoDB service, tests, coverage, and production build
- Multi-stage Docker image, Docker Compose, health check, and Render blueprint

## Architecture

```mermaid
flowchart TD
  UI[React PMS workspace] -->|REST + JWT| API[Express API]
  UI <-->|Socket.IO| RT[Real-time gateway]
  API --> C[Controllers]
  C --> M[Mongoose models]
  M --> DB[(MongoDB)]
UI --> LS[(Cache, drafts, offline queue)]
```

## Separate HTML pages

The client is configured as a Vite multi-page application. Each workspace view has its own HTML entry point, while the React components, shared CSS, authentication context, API client, and real-time behavior remain reusable.

### Member pages

`login.html`, `home.html`, `dashboard.html`, `board.html`, `tasks.html`, `add-task.html`, `members.html`, `contact.html`, `reports.html`, `notifications.html`, `request-admin.html`, `settings.html`, `activity.html`, and `profile.html`.

### Administrator pages

`admin-login.html`, `admin-dashboard.html`, `admin-tasks.html`, `admin-add-task.html`, `admin-members.html`, `admin-reports.html`, `admin-requests.html`, and `admin-settings.html`.

`index.html` is now only a small entry redirect to `login.html`; it does not contain the application UI. Run the client with Vite or build it before opening the pages so the module assets are served correctly.

## Quick start with Docker

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:8080`. MongoDB data is kept in the `pms_mongo` volume.

## Local development

Requirements: Node.js 20.19+ and MongoDB 7+.

```bash
cp .env.example .env
npm install
npm run dev
```

The React client runs at `http://localhost:5173`; Vite proxies API and WebSocket traffic to the API at `http://localhost:8080`.

## Test and build

```bash
TEST_MONGO_URI=mongodb://127.0.0.1:27017/pms_test npm test
npm run build
```

Without `TEST_MONGO_URI`, database integration tests are skipped while HTTP boundary tests and all client tests still run. CI supplies MongoDB and runs the full suite.

## Production values

- `MONGO_URI`
- `JWT_ACCESS_SECRET` (random, 32+ characters)
- `JWT_REFRESH_SECRET` (different random value, 32+ characters)
- `ADMIN_NAME`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `MEMBER_NAME`, `MEMBER_USERNAME`, `MEMBER_EMAIL`, `MEMBER_PASSWORD`

## Documentation

- [REST API contract](docs/API.md)
- [MongoDB schema](docs/SCHEMA.md)
- [Real-time, offline, and concurrency design](docs/REALTIME-CONCURRENCY.md)
- [Deployment checklist](docs/DEPLOYMENT.md)
- [Team reflection](TEAM-REFLECTION.md)

## Known limitations

- Attachments and external email delivery are outside the supplied brief.
- Offline queuing covers task mutations; board membership and administrator actions require a live connection.
- Socket.IO uses the in-process adapter. A multi-instance deployment should add the official Redis adapter.
