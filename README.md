# Industry Readiness Scoring System (IRSS)

A full-stack web application to assess student industry readiness based on CGPA, Skills, Internships, Certifications, and Projects.

---

## Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Spring Boot 3 (Java 17)
- **Database**: MongoDB

---

## 🗄️ Database Setup (Do This First)

1. Make sure **MongoDB** is installed and running on your local machine (default port `27017`).
2. There are no tables or schemas to execute; MongoDB creates the `irss_db` database and its collections (`users` and `scores`) automatically upon running the Spring Boot backend.
3. In `backend/src/main/resources/application.properties`, make sure the MongoDB connection URI matches your setup (default is already configured):

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/irss_db
```

---

## ▶️ Running the Backend

**Prerequisites**: Java 17, Maven

```bash
cd backend
mvn spring-boot:run
```

Backend starts at **http://localhost:8080**

---

## ▶️ Running the Frontend

**Prerequisites**: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

---

## 📊 Score Calculation (Total: 100 marks)

| Component      | Max Marks | Input Range |
|----------------|-----------|-------------|
| CGPA           | 25        | 0.0 – 10.0  |
| Skills         | 20        | 0 – 10      |
| Internships    | 20        | 0 – 5       |
| Certifications | 15        | 0 – 5       |
| Projects       | 20        | 0 – 5       |

## 🏁 Readiness Status

| Score | Status            |
|-------|-------------------|
| 80–100 | ✅ Industry Ready |
| 50–79  | ⚡ Almost Ready  |
| 0–49   | ❌ Needs Improvement |

---

## 🔗 API Endpoints

| Method | URL                      | Description                  |
|--------|--------------------------|------------------------------|
| POST   | `/api/register`          | Register new user (BCrypt)   |
| POST   | `/api/login`             | Validate user credentials    |
| POST   | `/api/score`             | Submit and save score        |
| GET    | `/api/scores/{userId}`   | Get previous scores for user |
