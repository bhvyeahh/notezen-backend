import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";

// Import Routers
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import notesRouter from "./routes/note.routes.js";
import todoRouter from "./routes/todo.routes.js";
import cardRouter from "./routes/card.routes.js";
import reviewRouter from "./routes/review.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

// 🔧 Load environment variables
dotenv.config();

const app = express();

// ✅ CORS setup (use env variable for frontend origin)
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/cards", cardRouter);
app.use("/api/v1/review", reviewRouter);

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "✅ OK",
    message: "NoteZen Backend is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Global error handler
app.use(errorMiddleware);

// ✅ Start server
const PORT = process.env.PORT || 5500;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await connectToDatabase();
    console.log("🟢 MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
});

export default app;
