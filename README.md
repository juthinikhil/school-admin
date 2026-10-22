# School Administration & Learning Platform

A multi-stakeholder school administration platform designed for **Principal**, **Teacher**, **Parents**, and **Students**, paired with a localized AI copilot layer.

---

## Part 1: High-Level System Design

### 1. Ingress & Microservices Topology
+---------------------------------------+
                 |         Clients / Frontend            |
                 |  (Web / Next.js & Mobile Flutter/App) |
                 +-------------------+-------------------+
                                     | (HTTPS / WSS)
                                     v
                 +---------------------------------------+
                 |      Kong / Traefik API Gateway       |
                 | (Auth, Rate Limiting, RBAC & Routing) |
                 +--+--------+---------+-----------+-----+
                    |        |         |           |     
    +---------------+        |         |           +---------------+
    v                        v         v                           v
+------------------+    +--------------+  +---------------+   +-------------------+
| Auth & Identity  |    | Academic &   |  | Attendance &  |   | Communication &   |
| Service          |    | Grading      |  | Schedules     |   | Notifications     |
| (OAuth2, JWT)    |    | Service      |  | Service       |   | Service           |
+--------+---------+    +-------+------+  +-------+-------+   +---------+---------+
|                      |                 |                     |
v                      v                 v                     v
[Postgres Auth]        [Postgres Acad]    [Postgres Sched]      [Redis / RabbitMQ]


### 2. Stakeholder Roles & Access Controls (RBAC)

| Role | Core Responsibilities & Views | Permissions |
| :--- | :--- | :--- |
| **Principal** | School-wide analytics, staff management, financial tracking, approvals, policy broadcasts, compliance. | Global read/write, user management, audit logs, administrative approvals. |
| **Teacher** | Class rosters, grade book, daily attendance tracking, lesson planning, student feedback, homework assignment. | Class-bounded read/write (assigned classrooms & enrolled students only). |
| **Parent** | Student performance monitoring, attendance alerts, fee invoice/payment, direct teacher messaging. | Child-bounded read access, payment submission, messaging initiation. |
| **Student** | Coursework access, homework submission, exam schedules, learning materials, report cards. | Self-bounded read access, assignment upload/submission. |

### 3. Microservice Boundaries
- **API Gateway & Ingress**: Handles TLS termination, request validation, tenant routing, and RBAC token inspection before internal dispatch.
- **Identity & Directory Service**: Manages multi-tenant credentials, role hierarchies (`Principal -> Teacher -> Student/Parent`), session invalidation, and parent-child association graphs.
- **Academic & Curriculum Service**: Manages subject catalogs, syllabus schedules, assignment creation, grading rubrics, and gradebook exports.
- **Attendance & Operations Service**: Ingests daily attendance logs (manual or automated biometric/RFID tags), school calendars, timetables, and leave workflows.
- **Communication & Notification Service**: Publishes real-time push alerts, emergency SMS broadcasts, parent-teacher messaging via WebSockets, and scheduled email reports.
- **Fee & Billing Service**: Manages tuition schedules, invoice generation, payment gateway integration, and receipt reconciliation.

### 4. Data Architecture & Persistence
- **Transactional Database (PostgreSQL)**: Database-per-service pattern (`identity_db`, `academic_db`, `attendance_db`, `billing_db`).
- **Caching & Real-Time Sync (Redis)**: Session tokens, active classroom attendance caches, and pub/sub message brokers for real-time alerts.
- **Blob / Object Storage (MinIO or S3)**: Student homework uploads, report card PDFs, lesson plans, and system export backups.

---

## Part 2: System AI Design (AI Architecture)

+---------------------------------------------------------------------------------------+
|                               AI INFERENCE GATEWAY                                    |
|              (Routes tasks based on privacy, latency, and context budget)             |
+---------------------------------------------------------------------------------------+
|                                       |                               |
v                                       v                               v
+-----------------------+              +-------------------+          +-------------------+
| Admin & Insights Agent|              | Teacher Copilot   |          | Student / Parent  |
| (Principal Dashboard) |              | (Grading/Rubrics) |          | Assistant         |
+-----------+-----------+              +---------+---------+          +---------+---------+
|                                    |                              |
+-------------------+----------------+------------------------------+
|
v
+-------------------------------+
|   Context Engine & Vector DB  |
| (Qdrant / pgvector: RAG Docs) |
+---------------+---------------+
|
v
+-------------------------------+
| Local / Hosted LLM Inference  |
| (Ollama / Local vLLM / APIs)  |
+-------------------------------+


### 1. Role-Specific AI Agents
- **Principal Copilot (Institutional Health & Risk Analytics)**:
  - *Early Warning Engine*: Anomaly detection across attendance, disciplinary notes, and grades to surface students at risk of dropout or failure.
  - *School Operations Summarizer*: Automatically compiles weekly operations digests.
  - *Policy & Communication Drafter*: Drafts administrative announcements and safety alerts grounded in handbooks via RAG.
- **Teacher Copilot (Curriculum & Grading Assistant)**:
  - *Differentiated Lesson Planner*: Creates multi-tiered lesson plans, quizzes, and assignments.
  - *Draft Evaluation & Rubric Scoring*: Pre-grades essays and descriptive responses against a strict rubric.
  - *Parent Update Generator*: Summarizes individual student progress into constructive progress updates.
- **Parent Assistant (Academic Interpreter)**:
  - *Performance Translation*: Summarizes report cards and homework completion metrics into plain-language actionable advice.
  - *Multilingual Translation*: Translates teacher notices, consent forms, and messages into the parent's primary language.
- **Student Tutor (Grounded Study Companion)**:
  - *Curriculum-Grounded Socratic Tutor*: Answers student questions using verified textbooks and class notes via RAG with guided hints rather than direct homework solutions.
  - *Revision Schedule Optimizer*: Generates adaptive revision quizzes based on past mistakes and upcoming exams.

### 2. Core AI Pipelines & Infrastructure

                             [Document Ingestion]
         (Syllabus, Textbooks, School Policies, Lecture Transcripts)
                                     |
                                     v
                            [Chunking & Parsing]
                                     |
                                     v
                          [Embedding Computation]
                         (e.g., bge-small-en-v1.5)
                                     |
                                     v
                         +-----------------------+
                         |   Vector Store DB     |
                         | (pgvector / Qdrant)   |
                         +-----------+-----------+
                                     |
[User Query + Role Metadata]             | (Hybrid Search: Vector + Keyword)
|                            v
+------------------> [Context Assembly]
|
v
[Strict Prompt Injection]
|
v
[Inference Engine (LLM)]
|
v
[Guardrails & Filters]
(PII Check, Grounding)
|
v
[User Interface/API]


- **Context & RAG Engine**: School handbooks, course materials, and state curriculum standards are ingested into an isolated vector database (`pgvector` or `Qdrant`) with strict grade and role filtering.
- **Inference Layer**:
  - *Structured Reasoning / Long-Form Analysis*: Larger coding/reasoning models handle rubrics, report generation, and multi-step policy tasks.
  - *Real-Time Tutors*: Low-latency 3B to 7B parameter local models handle instant Q&A, spelling/grammar reviews, and quick Socratic suggestions.
- **Privacy, Compliance & Safety Guardrails**:
  - *Zero PII Leakage*: Student IDs, contact details, and sensitive records are stripped or pseudonymized before prompts are dispatched to inference.
  - *Deterministic System Prompt*:
    ```text
    You are a safe, pedagogical assistant for school students.
    - Never provide direct solutions to homework questions; provide conceptual hints.
    - Cite strictly from verified course context provided.
    - Immediately flag self-harm, harassment, or abuse signals to the school counselor.
    ```
  - *Deterministic Audit Trail*: All AI evaluations and communications log raw inputs, model metadata, and outputs to an immutable audit ledger.

---

## Machine-Readable Reference
The complete design schema is available in JSON format at:
```bash
cat docs/system-design.json
