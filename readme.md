# 📝 Notes App API

A powerful and scalable backend API built with **Node.js, Express, and MongoDB**, designed to help users manage **Notes**, **To-Dos**, and implement **Spaced Repetition Learning** with **Daily Streak Tracking**.

---

## 🚀 Features

### ✅ User Authentication
- JWT-based secure login/signup.
- Middleware-protected routes for authorized access.

### 🗒️ Notes
- Create, update, fetch, and delete personal notes.
- Each note is linked to the authenticated user.
- Helps organize thoughts, study material, or personal memos.

### 📋 To-Dos
- Manage daily tasks with:
  - Title
  - Completion status
- CRUD operations supported.
- Track completed tasks and manage your productivity.

### ⏳ Spaced Learning Cards
- Flashcards-style Q&A system.
- Supports **spaced repetition** algorithm (SM2-like):
  - `ease`, `interval`, and `nextReview` fields.
  - Automatically adjusts next review date based on performance.

### 🔥 Streak Tracking
- Keeps track of user’s daily engagement.
- Increases streak count only if the user reviews **at least one card each day**.
- Helps users stay consistent with learning.

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT Tokens
- **Dev Tools:** Nodemon, Morgan, ESLint

---

## 📁 Project Structure

```
/controllers     -> Route logic for Notes, Todos, Cards, etc.
|-- cardController.js
|-- noteController.js
|-- todoController.js

/models          -> Mongoose models for DB schema
|-- User.js
|-- Note.js
|-- Todo.js
|-- Card.js

/routes          -> All Express route files
|-- userRoutes.js
|-- noteRoutes.js
|-- todoRoutes.js
|-- cardRoutes.js

/middleware      -> Auth middleware
|-- authorize.js

/config          -> DB connection and ENV setup
|-- db.js

server.js        -> Main server entry point
.env             -> Environment variables
```

---

## 📖 API Endpoints Overview

### 🔐 Auth Routes
| Method | Route         | Description        |
|--------|---------------|--------------------|
| POST   | `/auth/register` | Register new user |
| POST   | `/auth/login`    | Login user        |

---

### 🗒️ Notes Routes
| Method | Route            | Description             |
|--------|------------------|-------------------------|
| POST   | `/notes/`        | Create a note           |
| GET    | `/notes/`        | Fetch all notes         |
| PUT    | `/notes/:id`     | Update note by ID       |
| DELETE | `/notes/:id`     | Delete note by ID       |

---

### 📋 Todos Routes
| Method | Route            | Description             |
|--------|------------------|-------------------------|
| POST   | `/todos/`        | Create a todo           |
| GET    | `/todos/`        | Fetch all todos         |
| PUT    | `/todos/:id`     | Update todo             |
| DELETE | `/todos/:id`     | Delete todo             |

---

### 🧠 Cards (Spaced Learning) Routes
| Method | Route              | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/cards/`          | Create flashcard               |
| GET    | `/cards/`          | Get all due review cards       |
| PUT    | `/cards/:id/review`| Submit review & update streak  |

---

## 💡 Why This Project?

In a world full of information overload, staying productive and learning effectively is challenging. This project was built to:
- Combine **productivity** (notes + todos) with **cognitive science** (spaced repetition).
- Encourage consistent engagement through **streak mechanics**.
- Provide a clean and modular backend API that’s easy to integrate into any frontend (mobile/web).

---

## 🧪 Future Enhancements

- Add tagging system for Notes and Todos.
- Integrate email reminders for daily reviews.
- Create leaderboard of streaks for gamification.
- Web UI using React/Next.js.

---

## 🧔 Author

**Bhavya Rathore**  
Backend Developer | MERN Stack | Loves building smart tools  


