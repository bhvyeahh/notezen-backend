import { config } from "dotenv";
import path from "path";

// 🧩 Load correct .env file depending on environment
const env = process.env.NODE_ENV || "development";
const envFile =
  env === "production"
    ? ".env" // Render or Vercel will inject directly
    : `.env.${env}.local`;

config({ path: path.resolve(process.cwd(), envFile) });

// 🧠 Log active environment (optional, remove if you prefer silence)
console.log(`🌍 Environment loaded: ${envFile}`);

// ✅ Export variables safely
export const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  EMAIL_USER,
  EMAIL_PASS,
  FRONTEND_URL,
  SERVER_URL,
} = process.env;

// 🚨 Warn if something critical is missing
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables.");
}
if (!JWT_SECRET) {
  console.error("⚠️ JWT_SECRET is missing. Please set it in your .env file.");
}
