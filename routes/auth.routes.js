import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  registerAfterOtp,
  signIn,
  signOut,
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const authRouter = Router();

// OTP-based signup routes
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/register-after-otp", registerAfterOtp);

// Sign-in/out
authRouter.post("/sign-in", signIn);
authRouter.get("/sign-out", signOut);

// Protected route example
authRouter.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

export default authRouter;
