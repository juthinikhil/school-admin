# Objective: Full-Stack School Administration & Learning Platform

Implement all services and endpoints adhering strictly to `docs/system-design.json`. Every service must run in Node.js (Express), bind to `0.0.0.0` on its assigned port, and implement full business logic without placeholders or `// TODO` comments.

## 1. Services to Implement

### `auth-service` (Port 4000)
- Endpoints: `GET /health`, `POST /register`, `POST /login`, `GET /me`.
- Roles: `Principal`, `Teacher`, `Parent`, `Student`.
- Issues signed JWT tokens containing the username and role.

### `academic-service` (Port 4001)
- Endpoints: `GET /health`, `GET /courses`, `POST /courses`, `GET /assignments`, `POST /assignments`.
- Role checks: Only `Teacher` can POST courses/assignments; all roles can GET.

### `attendance-service` (Port 4002)
- Endpoints: `GET /health`, `POST /attendance/mark`, `GET /attendance/:classId`.
- Persists attendance records; uses Redis for quick daily status checks.

### `billing-service` (Port 4003)
- Endpoints: `GET /health`, `GET /invoices`, `POST /invoices`.
- Manages tuition fees, payment status (`Paid`, `Pending`), and student IDs.

### `comms-service` (Port 4004)
- Endpoints: `GET /health`, `GET /notices`, `POST /notices`.
- Broadcasts notices filterable by target audience (`All`, `Parents`, `Teachers`, `Students`).

### `ai-service` (Port 5002)
- Endpoints: `GET /health`, `POST /generate`.
- Connects to the local Ollama instance (`http://172.17.0.1:11434` or `http://localhost:11434`) running `qwen2.5-coder:7b`.
- Injects role-tailored system prompts (Principal = Operations, Teacher = Lesson/Rubrics, Parent = Plain-language explainer, Student = Socratic tutor).

## 2. API Documentation & UI
- Add Swagger/OpenAPI documentation (`swagger-ui-express`) mounted on `/docs` inside each service, OR generate a unified `docs/swagger.json` conforming to OpenAPI 3.0.
- In `frontend/index.html`, build a clean, responsive single-page dashboard with role tabs (`Principal`, `Teacher`, `Parent`, `Student`) that fetches live data from the services and includes an interactive chat box querying the `ai-service`.

## 3. Automated Tests & Docker
- Create a test script `test-all-services.sh` using `curl` to assert HTTP 200 on all `/health` and domain endpoints.
- Ensure the root `docker-compose.yml` maps all host ports (3000, 4000, 4001, 4002, 4003, 4004, 5002) and builds cleanly.
