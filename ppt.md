# 🏥 Healthazon — Technical Presentation Deck & Interview Walkthrough

**Candidate:** Karan Devgan  
**Role:** Full Stack Engineer  
**Company Interview:** Illuminati Consulting  
**Interview Window:** Saturday, 8 August 2026 | 10:00 AM – 1:00 PM  
**Presentation Target Duration:** 10 Minutes (2–3 Slide Walkthrough + Q&A)

---

## 🎯 Executive Summary & Presentation Plan

This presentation deck and technical walkthrough is structured around **Healthazon**, a production-grade full-stack health-tech appointment and consultation management platform built on the **MERN** architecture (MongoDB, Express.js, React 19, Node.js). 

The presentation is compressed into a high-impact **3-slide deck** designed for a 10-minute slot, followed by an exhaustive technical reference and interview Q&A response guide.

```
+-----------------------------------------------------------------------------------+
|                                 PRESENTATION TIMELINE                             |
+-----------------------------------------------------------------------------------+
|  [0:00 - 3:00]  | SLIDE 1: Project Vision, Features & High-Level Architecture    |
|  [3:00 - 7:00]  | SLIDE 2: Technical Deep-Dive: Node Ecosystem, Docker & CI/CD   |
|  [7:00 - 10:00] | SLIDE 3: Engineering Challenges, Single-Server Fix & Security   |
+-----------------------------------------------------------------------------------+
```

---

## 🤖 Google Gemini Prompts (For Google Slides)

Copy and paste these exact prompts into **Gemini in Google Slides** ("Help me create a slide" or Gemini side panel) to automatically generate the 3 presentation slides.

---

### 🔹 PROMPT 1: For Slide 1 (Overview, Core Product & Architecture)

```text
Create a modern, clean, professional presentation slide for a full-stack engineering interview presentation.

Slide Title: Healthazon — Full-Stack Healthcare Consultation Platform
Subtitle: High-Level Architecture, Core Product & Problem Solved

Layout Structure:
Use a 2-column layout with teal, slate blue, and clean light-gray health-tech styling.

Left Column - Problem & Solution:
- Top Badge: "Domain: Digital Health & Telemedicine | Stack: MERN (React 19 + Node 18 + MongoDB)"
- Section: Problem Solved: Healthcare scheduling suffers from fragmented doctor availability tracking and high cost of managing separate frontend/backend deployments.
- Section: Solution Delivered: Healthazon provides unified doctor discovery, real-time appointment booking, doctor availability management, and role-based portals for patients & doctors.

Right Column - MERN Architecture & Key Features:
- Card 1 (System Flow): Client Browser (React 19 SPA + Framer Motion) -> HTTP Same-Origin Calls (/api/*) -> Express 5 Single Server (Node.js) -> Mongoose 8 -> MongoDB Cloud Database.
- Card 2 (Core Portals):
  • Patient Portal: Doctor directory with search & filters, appointment booking, status tracking.
  • Doctor Portal: Dashboard, appointment management (confirm/cancel/reschedule), availability controls.
  • Security: JWT Authentication with Role-Based Access Control (RBAC).

Visual Style: Include clear card containers, subtle dark blue headers, green accent highlights, and clean typography suitable for a 10-minute technical interview presentation.
```

---

### 🔹 PROMPT 2: For Slide 2 (Technical Deep Dive — Node Ecosystem, Docker & CI/CD)

```text
Create a highly structured, technical system architecture presentation slide for a senior software engineering interview walkthrough.

Slide Title: System Engineering — Tech Stack, Containerization & CI/CD Pipeline
Subtitle: Full Node Ecosystem, Multi-Stage Docker Build & Automated Deployment

Layout Structure:
Use a 3-column container layout with modern developer dark/cyan tech accents.

Column 1 - Full Stack Node Ecosystem:
- Title: Key Node Dependencies
- Frontend: React 19, React Router v7 (SPA routing), Axios (relative /api client), Framer Motion (animations), TailwindCSS v4, React-Toastify.
- Backend: Express 5 (routing & static host), Mongoose 8 (ODM), jsonwebtoken (JWT auth), bcryptjs (salted password hashing), Nodemailer (email notifications), Express-Async-Handler.

Column 2 - Multi-Stage Docker Build Architecture:
- Title: Optimized Docker Image (~150MB)
- Stage 1 (Frontend Builder): Node 18 Alpine compiles Vite React SPA into frontend/dist.
- Stage 2 (Production Runtime): Node 18 Alpine installs production-only dependencies, copies backend code and built frontend/dist from Stage 1. Runs `node server.js` on Port 8080.
- Result: 65% image size reduction with zero dev artifacts in production.

Column 3 - Automated GitHub Actions CI/CD:
- Title: Tag-Driven CI/CD Pipeline (`deploy.yml`)
- Step 1: Push Git Tag `v*` (e.g. v1.0.0).
- Step 2: GitHub Actions builds Docker image & pushes to Docker Hub with release tag.
- Step 3: Trigger Render zero-downtime deployment via URL-encoded webhook POST request.

Visual Style: Use neat architectural cards, technology badge styling, arrow process flows, and high contrast code container aesthetics.
```

---

### 🔹 PROMPT 3: For Slide 3 (Key Engineering Decisions, Problem Solving & Security)

```text
Create an executive engineering summary slide highlighting technical problem solving, security hardening, and developer tooling for a full-stack capstone project presentation.

Slide Title: Key Engineering Decisions, Security & Quality Automation
Subtitle: Solved Technical Challenges, RBAC Security & Developer Verification Suite

Layout Structure:
Use a 3-row or 3-box feature comparison layout with bold highlight header callouts.

Card 1 - Critical Challenge Solved: Single-Server SPA Route Fallback
- Problem: Consolidating backend API and frontend static build into Express 5 caused path wildcard collisions (`app.get('*')`) and broke React Router navigation.
- Solution: Engineered custom non-blocking middleware in `server.js` checking `req.path.startsWith('/api')`. API calls bypass static fallback while SPA routes cleanly serve `index.html`.

Card 2 - Security Architecture & RBAC Hardening:
- JWT Bearer Token Auth: Stateless session verification attached to `req.user`.
- Role-Based Access Control: Custom `authMiddleware` & `roleMiddleware` enforcing Doctor/Patient scope.
- Ownership Validation: Strict checks ensuring users can only modify/cancel appointments matching their own Patient ID or Doctor ID.

Card 3 - Verification Suite & Seeding Engine:
- Seeding CLI (`seedUsers.js`): Command-line tool supporting `--type=all|doctors|patients`, `--reset`, and `--dry-run` schema validation mode.
- Integration Verification (`verify-setup.sh`): Automated script testing API health check (`/api/health`), static HTML delivery, and SPA route fallback integrity.

Visual Style: Use polished callout cards, clean checkmark bullet points, bold key terms, and executive engineering highlight styling.
```

---

---

## 🎬 SLIDE 1: Overview, Core Product & Architecture

### **Slide Title: Healthazon — Full-Stack Healthcare Consultation Platform**

```
+-----------------------------------------------------------------------------------------+
|                                    PROJECT SNAPSHOT                                     |
|  • Domain: Digital Health & Telemedicine      • Type: Production MERN Web Application   |
|  • Primary Stack: React 19 + Vite + Node 18   • Deployment: Single-Server Docker/Render |
+-----------------------------------------------------------------------------------------+
```

#### **1. Problem & Core Solution**
* **The Problem:** Healthcare scheduling often suffers from disjointed patient discovery, fragmented availability tracking, and high maintenance costs of managing separate backend and frontend deployments.
* **The Healthazon Solution:** A unified health-tech platform providing seamless doctor discovery, real-time appointment booking, doctor availability management, and role-based access for patients and healthcare providers.

#### **2. System Architecture Diagram**
```
                    +-------------------------------------------------+
                    |                CLIENT BROWSER                   |
                    | React 19 SPA + React Router v7 + Framer Motion |
                    +------------------------+------------------------+
                                             |
                                  HTTP Same-Origin Calls
                                    (/api/* & Static)
                                             |
                                             v
                    +-------------------------------------------------+
                    |              EXPRESS SINGLE SERVER              |
                    |              (Node.js 18 / Express 5)           |
                    |  - Routes: /api/auth, /api/patient, /api/doctor |
                    |  - Middleware: CORS, Auth JWT, Async Error Hdlr |
                    |  - Static Middleware: Serves frontend/dist      |
                    +------------------------+------------------------+
                                             |
                                     Mongoose ODM (v8.17)
                                             |
                                             v
                    +-------------------------------------------------+
                    |             MongoDB CLOUD DATABASE              |
                    |  Collections: Users, Doctors, Patients, Appts   |
                    +-------------------------------------------------+
```

#### **3. Core Features Delivered**
* **Patient Portal:** Doctor directory with specialty filter & search, real-time appointment booking, interactive status tracking (Pending, Confirmed, Cancelled), patient profile management.
* **Doctor Portal:** Dedicated dashboard, appointment management (confirm/cancel/reschedule), profile completion & availability management.
* **Authentication & Security:** JWT authentication with role-based access control (RBAC), bcrypt password hashing, secure reset tokens.

---

### 🎙️ *Slide 1 Speaker Script (Duration: ~3 Minutes)*
> *"Good morning/afternoon. Today I’m excited to present **Healthazon**, a full-stack digital healthcare consultation platform built using the MERN stack. Healthazon solves a common challenge in health-tech: connecting patients with specialized doctors through a streamlined booking and management interface while maintaining low operational deployment overhead.*
>
> *Architecturally, the application features a unified frontend built with React 19 and Vite, integrated seamlessly with a Node.js and Express backend backed by MongoDB. We engineered the application using a **Single-Server Deployment Architecture**, where a single Express server handles both our JSON API requests and serves the optimized client-side SPA. In the next slides, I'll walk through how we implemented this architecture, our Docker and CI/CD pipelines, and key engineering problems we solved."*

---

## 🎬 SLIDE 2: Technical Deep Dive — Node Ecosystem, Docker & CI/CD Pipeline

### **Slide Title: System Engineering — Packages, Containerization & Automation**

```
+-----------------------------------------------------------------------------------------+
|                                    STACK & AUTOMATION                                   |
|  • Frontend: React 19, Vite, Axios, TailwindCSS v4, Framer Motion, React-Toastify       |
|  • Backend: Express 5, Mongoose 8, JWT, bcryptjs, Nodemailer, Async Handler             |
|  • DevOps: Multi-Stage Dockerfile, GitHub Actions CI/CD, Docker Hub, Render Webhooks    |
+-----------------------------------------------------------------------------------------+
```

#### **1. Full Node Ecosystem Breakdown**

| Component | Library / Package | Version | Purpose in Healthazon |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | `react` / `react-dom` | `^19.1.0` | Component-based UI with React 19 concurrent features |
| **Routing** | `react-router-dom` | `^7.7.1` | Declarative client-side routing & protected layout wrappers |
| **Build System** | `vite` | `^7.0.4` | Lightning-fast HMR and optimized production bundle compilation |
| **HTTP Client** | `axios` | `^1.11.0` | Centralized API client configured with relative `/api` base URL |
| **Animations & UI** | `framer-motion` | `^12.23.12` | Smooth layout transitions, modal animations, and micro-interactions |
| **Styling** | `tailwindcss` | `^4.1.11` | Utility-first styling with PostCSS & Autoprefixer |
| **Notifications** | `react-toastify` | `^11.0.5` | Feedback alerts for auth, booking status, and validation errors |
| **Backend Core** | `express` | `^5.1.0` | Modular API routing engine & static asset server |
| **Database ODM** | `mongoose` | `^8.17.0` | Schema definitions, validation, and MongoDB interactions |
| **Auth & Hashing** | `jsonwebtoken` / `bcryptjs` | `^9.0.2` / `^3.0.2` | Stateless JWT token issuance and 10-salt bcrypt password hashing |
| **Mail & Utilities** | `nodemailer` / `express-async-handler` | `^7.0.5` / `^1.2.0` | SMTP password reset notifications & clean try-catch elimination |

---

#### **2. Multi-Stage Docker Build Process**
We implemented a **two-stage build process** in a single `Dockerfile` to create a lightweight, production-ready container image (~150MB):

```
+-----------------------------------------------------------------------------------------+
| STAGE 1: FRONTEND BUILD (node:18-alpine)                                                |
|   1. Copy frontend/package.json & install dependencies                                  |
|   2. Run `vite build` -> Generates static HTML/JS/CSS assets in frontend/dist            |
+-----------------------------------------------------------------------------------------+
                                           |
                              Copy built dist artifacts only
                                           v
+-----------------------------------------------------------------------------------------+
| STAGE 2: PRODUCTION RUNTIME (node:18-alpine)                                            |
|   1. Copy backend/package.json & install --production dependencies only                 |
|   2. Copy backend source code                                                           |
|   3. COPY --from=frontend-build /app/frontend/dist ./frontend/dist                      |
|   4. Expose Port 8080 & Execute `node server.js`                                       |
+-----------------------------------------------------------------------------------------+
```

---

#### **3. GitHub Actions CI/CD Pipeline Workflow**

Our `.github/workflows/deploy.yml` pipeline automates testing, image tagging, registry storage, and deployment trigger on tag push:

```
[Git Tag Push (e.g. v1.0.0)]
           |
           v
+------------------------------------+      +------------------------------------+
| JOB 1: Build & Push Docker Image   |      | JOB 2: Trigger Render Deployment   |
|  - Checkout code via actions/v4    | ---> |  - Extract release tag from HEAD   |
|  - Authenticate to Docker Hub      |      |  - URL-encode target image string  |
|  - Build tagged image              |      |  - Execute POST trigger to Render  |
|  - Push tag to Docker Hub Registry |      |    deploy webhook with imgURL param|
+------------------------------------+      +------------------------------------+
```

---

### 🎙️ *Slide 2 Speaker Script (Duration: ~4 Minutes)*
> *"Moving into our technical stack and engineering workflow: on the frontend, we chose React 19 coupled with Vite for ultra-fast builds, Framer Motion for crisp animations, and TailwindCSS v4 for modern styling. Axios is configured with a base URL of `/api`, enabling seamless relative path querying.
>
> On the backend, we run Express 5 with Mongoose 8. We utilize `jsonwebtoken` for stateless auth tokens and `bcryptjs` for salted password hashing.
>
> One key technical highlight is our **Multi-stage Dockerfile**. Stage 1 compiles our Vite frontend into static bundles inside a temporary Alpine environment. Stage 2 copies only those compiled assets alongside production-only Node dependencies into our backend container. This reduced our Docker image size by over 65%.
>
> Our **GitHub Actions CI/CD workflow** triggers whenever a tag prefixed with `v*` is pushed. It builds the Docker image, tags it with the release version, pushes it to Docker Hub, and sends a secure webhook call to trigger an automated zero-downtime deployment on Render."*

---

## 🎬 SLIDE 3: Engineering Challenges, Single-Server Fix & Security

### **Slide Title: Key Engineering Decisions, Problem Solving & Security**

```
+-----------------------------------------------------------------------------------------+
|                                    SOLVED CHALLENGES                                    |
|  • Single-Server Integration & SPA Fallback Route Fix                                    |
|  • Security Hardening & Role-Based Access Control (RBAC)                                |
|  • Automated Seeding & Self-Healing Verification Suite                                  |
+-----------------------------------------------------------------------------------------+
```

#### **1. Critical Technical Problem & Solution: Single-Server SPA Fallback**

* **The Problem:** When consolidating backend API and frontend static file serving into a single Express server, standard wildcard routes like `app.get('*', ...)` caused `path-to-regexp` throwing errors in Express 5, and interfered with `/api` endpoints.
* **The Solution:** Custom non-interfering middleware with dynamic frontend dist resolution:

```javascript
// Server path resolution & SPA Routing Fix (backend/server.js)
const possiblePaths = [
  path.resolve(process.cwd(), "frontend", "dist"),
  path.resolve(process.cwd(), "..", "frontend", "dist"),
];

let frontendBuildPath = possiblePaths.find(p => fs.existsSync(p));

if (frontendBuildPath) {
  app.use(express.static(frontendBuildPath));

  // Middleware SPA fallback avoiding wildcard pattern errors:
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}
```

#### **2. Security Architecture & Hardening**
* **Role-Based Access Control (RBAC):** Custom Express middleware (`authMiddleware.js` and `roleMiddleware.js`) inspects incoming Bearer JWT tokens, attaches `req.user`, and verifies explicit privileges (`patient` vs `doctor` vs `admin`) before granting access to protected routes.
* **Strict Ownership Validation:** Locked down appointment modification endpoints to prevent ID tampering; users can only cancel/reschedule appointments where `patientId === req.user.id` or `doctorId === req.user.id`.
* **Sanitized Responses:** Stripped sensitive user password hashes from JSON return payloads using schema transformation options.

#### **3. Verification & Database Seeding Engine**
* **Database Seeding CLI:** Created custom CLI tooling (`backend/scripts/seedUsers.js`) with support for `--type=all|doctors|patients`, `--reset` mode, and `--dry-run` validation to test mock population without mutating production databases.
* **Single-Server Integration Suite:** Built `verify-setup.sh` bash script to automatically test `/api/health`, static HTML serving, database doctor queries, and SPA client-side route fallbacks.

---

### 🎙️ *Slide 3 Speaker Script (Duration: ~3 Minutes)*
> *"To conclude, I’d like to highlight the key technical challenges solved during development.
>
> First, when migrating to a consolidated single-server deployment, using naive wildcard catch-all routes caused path matching conflicts with Express 5's upgraded router. I resolved this by writing a custom non-blocking middleware layer that checks if the request path starts with `/api`; if not, it cleanly yields to `sendFile(index.html)` allowing React Router to handle client-side routes like `/doctors` or `/patient/dashboard`.
>
> Second, on security: we implemented robust RBAC middleware that parses JWTs, verifies user roles, and enforces ownership checks on sensitive operations like appointment cancellation to prevent authorization bypasses.
>
> Lastly, we established dev productivity tools including a custom database seeding script supporting `--dry-run` flags and an automated `verify-setup.sh` suite that asserts health check endpoints, HTML delivery, and fallback logic before deployments.
>
> Thank you for your time, and I welcome any questions about the architecture or implementation details."*

---

# 📖 Deep-Dive Technical Reference & Cheatsheet

*(Use this section during the technical Q&A to answer granular questions about any package, file, line of code, or configuration).*

---

## 📦 Complete Node.js Package Reference

### **Frontend Dependencies (`frontend/package.json`)**

1. **`react` (`^19.1.0`) & `react-dom` (`^19.1.0`)**
   * *Role:* Core frontend library. Utilizes React 19's optimized rendering and hooks (`useState`, `useEffect`, `useContext`, `useMemo`).
2. **`react-router-dom` (`^7.7.1`)**
   * *Role:* Client-side routing engine. Handles navigation between public pages (`/`, `/about`, `/doctors`) and protected dashboards (`/patient/dashboard`, `/doctor/dashboard`).
3. **`axios` (`^1.11.0`)**
   * *Role:* Promise-based HTTP client. Pre-configured in `frontend/src/services/api.js` with `baseURL: "/api"` so requests use relative paths regardless of domain.
4. **`framer-motion` (`^12.23.12`)**
   * *Role:* Production animation library used for smooth page transitions, interactive cards, and modal dialog entrance/exit effects.
5. **`react-icons` (`^5.5.0`)**
   * *Role:* Vector icon set providing medical, calendar, user, and navigation icons across the application UI.
6. **`react-toastify` (`^11.0.5`)**
   * *Role:* Provides non-intrusive UI toast notifications for user feedback (e.g. "Appointment booked successfully", "Invalid credentials").
7. **`tailwindcss` (`^4.1.11`), `postcss` (`^8.5.6`), `autoprefixer` (`^10.4.21`)**
   * *Role:* Styling infrastructure providing rapid utility-first UI design and browser CSS prefixing.
8. **`vite` (`^7.0.4`) & `@vitejs/plugin-react` (`^4.6.0`)**
   * *Role:* Modern frontend build tool offering instant server start with ES modules and optimized production bundler using Rollup.

### **Backend Dependencies (`backend/package.json`)**

1. **`express` (`^5.1.0`)**
   * *Role:* Core web server framework managing API routes, JSON parsing, static file middleware, and SPA fallbacks.
2. **`mongoose` (`^8.17.0`)**
   * *Role:* Object Data Modeling (ODM) library for MongoDB. Provides strict schema definitions, indexing, validation, and population (`.populate("doctorId")`).
3. **`jsonwebtoken` (`^9.0.2`)**
   * *Role:* Issues signed JWT tokens upon login containing user ID and role claims (`user: { id, role }`). Verified in request headers via `authMiddleware`.
4. **`bcryptjs` (`^3.0.2`)**
   * *Role:* Password hashing library using salted bcrypt algorithm (`await bcrypt.hash(password, 10)`) to ensure raw passwords are never stored in MongoDB.
5. **`cors` (`^2.8.5`)**
   * *Role:* Cross-Origin Resource Sharing middleware. Allows local separate dev server origin access (`localhost:5173`) while operating safely in production.
6. **`cookie-parser` (`^1.4.7`)**
   * *Role:* Parses HTTP cookies attached to incoming client requests for cookie-based session verification support.
7. **`dotenv` (`^17.2.1`)**
   * *Role:* Loads environment variables from `.env` files into `process.env` (e.g., `MONGO_URI`, `JWT_SECRET`, `PORT`).
8. **`nodemailer` (`^7.0.5`)**
   * *Role:* SMTP mail sender used to dispatch password reset emails and appointment confirmation notifications.
9. **`express-async-handler` (`^1.2.0`)**
   * *Role:* Wrapper utility for Express async route handlers that automatically catches rejected promises and passes errors to Express error middleware without explicit `try-catch`.
10. **`nodemon` (`^3.1.10`) [DevDependency]**
    * *Role:* Development monitor that automatically restarts the Node server upon backend source code changes.

---

## 🛠️ Code Architecture & File Structure

```
s84_KaranDevgan_Capstone_Healthazon/
├── Dockerfile                        # Multi-stage Docker build configuration
├── SINGLE_SERVER_SETUP.md            # Comprehensive single-server documentation
├── verify-setup.sh                   # Bash script for verifying deployment health
├── .github/
│   └── workflows/
│       ├── test.yml                  # PR verification workflow
│       └── deploy.yml                # Production build & deploy workflow
├── backend/
│   ├── server.js                     # Express entry point, static build server & SPA fallback
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup via Mongoose
│   ├── controllers/
│   │   ├── authController.js         # Register, Login, Forgot/Reset Password logic
│   │   ├── doctorController.js       # Doctor listings, profile update & search
│   │   ├── patientController.js      # Patient profile management
│   │   └── appointmentController.js  # Booking, rescheduling, cancellation logic
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT Bearer token authentication
│   │   └── roleMiddleware.js         # Role authorization enforcement (RBAC)
│   ├── models/
│   │   ├── User.js                   # Unified User schema (Patient/Doctor discriminator)
│   │   ├── Appointment.js            # Appointment schema (Doctor, Patient, Date, Time, Status)
│   │   ├── Availability.js           # Doctor working hours schema
│   │   └── Report.js                 # Medical report metadata schema
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints (/api/auth)
│   │   ├── doctorRoutes.js           # Doctor endpoints (/api/doctor)
│   │   ├── patientRoutes.js          # Patient endpoints (/api/patient)
│   │   └── appointmentRoutes.js      # Appointment endpoints (/api/appointment)
│   └── scripts/
│       └── seedUsers.js              # Database seed CLI with --dry-run and --reset flags
└── frontend/
    ├── vite.config.js                # Vite bundler configuration
    └── src/
        ├── App.jsx                   # Main React Router app & protected route layout
        ├── main.jsx                  # React DOM entry point
        ├── services/
        │   └── api.js                # Axios instance configured with relative "/api"
        ├── pages/
        │   ├── auth/                 # Login, Register, Password Reset views
        │   ├── common/               # Home, About, Contact, Doctor Directory & Details
        │   ├── doctor/               # Doctor Dashboard, Appointments, Availability, Profile
        │   └── patient/              # Patient Dashboard, Booking Form, Appointments, Reports
        └── components/               # Shared Navbars, Footers, Modals, Cards
```

---

## ❓ Technical Q&A Cheatsheet for Interview

### **Q1: Why did you migrate to a Single-Server setup instead of microservices or separate static hosting?**
* **Answer:** *"For a mid-sized application like Healthazon, hosting frontend and backend on separate platforms (e.g. Netlify + Render) introduces unnecessary latency, CORS complexity, dual deployment costs, and cross-domain cookie/header security risks. Consolidating into a single container where Express serves both API routes and static SPA bundles drastically simplifies deployment down to a single Docker image, eliminates CORS overhead in production, and provides same-origin `/api` calls."*

### **Q2: How does your SPA routing fallback work in `server.js` without breaking Express 5 API routes?**
* **Answer:** *"In Express 5, using standard string wildcard patterns like `app.get('*')` can lead to route matching syntax errors or swallow `/api` routes if defined in the wrong order. We implemented custom middleware placed after all `/api` routes that inspects `req.path`. If the path starts with `/api`, it passes execution to `next()`; otherwise, it executes `res.sendFile(index.html)`. This guarantees React Router handles deep URLs like `/doctors` or `/patient/dashboard` on page refresh without throwing 404s."*

### **Q3: How is Authentication and Security structured in the application?**
* **Answer:** *"We use stateless JWT authentication. When a user logs in via `/api/auth/login`, `authController` verifies the email, checks the hashed password using `bcrypt.compare()`, and returns a signed JWT payload containing `user: { id, role }`. The client attaches this token in the `Authorization: Bearer <token>` header. Our `authMiddleware` decodes the token, attaches the user to `req.user`, and `roleMiddleware` verifies if `req.user.role` has authority for the requested resource (e.g., doctor-only or patient-only endpoints)."*

### **Q4: Explain the Multi-Stage Dockerfile architecture.**
* **Answer:** *"Our Dockerfile uses two distinct stages to optimize image footprint and build isolation. In Stage 1 (`frontend-build`), Node 18 Alpine installs frontend dependencies and runs `npm run build` using Vite. In Stage 2 (Production), a fresh Node 18 Alpine image installs only production backend dependencies and copies the compiled `dist/` directory from Stage 1. This keeps developer tools and intermediate build caches out of the final runtime image, resulting in a tiny, secure container."*

### **Q5: How do GitHub Actions handle CD without hardcoded credentials?**
* **Answer:** *"Our `deploy.yml` workflow uses GitHub Encrypted Secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`, `RENDER_DEPLOY_HOOK_URL`). When a tag like `v1.0.0` is pushed, GitHub Actions authenticates with Docker Hub securely, builds the Docker image, tags it with the version tag, and pushes it. Then, it triggers Render's automated deploy hook by making an HTTP POST request with the URL-encoded image parameter, forcing Render to pull and deploy the exact new container."*

### **Q6: How does data seeding work and what is `--dry-run`?**
* **Answer:** *"We built a custom CLI script in `backend/scripts/seedUsers.js`. It parses command line flags such as `--type=all|doctors|patients`, `--reset`, and `--dry-run`. In standard mode, it hashes mock user passwords with bcrypt and inserts records into MongoDB. In `--dry-run` mode, it executes all schema validation and data mapping logic without issuing database write commands, allowing developers to test data integrity safely in CI environments."*

---

## 🏁 Checklist Before Presentation

- [x] Verify backend health endpoint (`curl http://localhost:5000/api/health`)
- [x] Run single-server test script (`./verify-setup.sh`)
- [x] Confirm Docker build compiles cleanly (`docker build -t healthazon:latest .`)
- [x] Review slide speaker scripts and timing (3 mins Slide 1, 4 mins Slide 2, 3 mins Slide 3)
- [x] Keep this `ppt.md` document handy during Q&A for instant reference.
