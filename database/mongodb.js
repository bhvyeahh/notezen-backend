import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGO_URI) {
  throw new Error("❌ MongoDB URI is not defined in environment variables.");
}

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", true); // Optional: avoids Mongoose deprecation warnings

    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // fail fast if MongoDB unreachable
    });

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} in ${NODE_ENV.toUpperCase()} mode`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Retry logic for Render restarts
    setTimeout(connectToDatabase, 5000);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
  });
};

export default connectToDatabase;
