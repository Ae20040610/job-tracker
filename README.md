# Applytrack – Job Application Tracker

React + Spring Boot + MySQL.

## 1. Database
Install MySQL and make sure it is running. The `job_tracker` database and all tables are created
automatically on first start. Edit `backend/src/main/resources/application.properties` with your MySQL username/password.

## 2. Backend (Eclipse)
1. File → Import → Maven → **Existing Maven Projects** → select the `backend` folder.
2. Right-click `JobTrackerApplication.java` → Run As → **Java Application** (JDK 17+).
3. API runs on http://localhost:8080 (try http://localhost:8080/api/applications).

## 3. Frontend (VS Code)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/applications?search=&status= | List / search / filter |
| GET | /api/applications/{id} | One application |
| POST | /api/applications | Create |
| PUT | /api/applications/{id} | Update |
| DELETE | /api/applications/{id} | Delete |
| GET | /api/applications/stats | Dashboard counts |
| POST | /api/applications/{id}/interviews | Add interview |
| DELETE | /api/applications/{id}/interviews/{interviewId} | Remove interview |
