# School Administration Architecture
- auth-service (Port 4000): PostgreSQL identity_db. Endpoints: POST /register, POST /login, GET /health, GET /me.
- academic-service (Port 4001): PostgreSQL academic_db. Endpoints: GET /courses, POST /courses, GET /assignments, POST /assignments, GET /health.
- attendance-service (Port 4002): PostgreSQL attendance_db, Redis caching. Endpoints: POST /attendance/mark, GET /attendance/:classId, GET /health.
- Roles: Principal (global), Teacher (classes), Parent (linked children), Student (self).
