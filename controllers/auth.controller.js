import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { sendEmailViaBrevo } from "../helpers/emailBrevo.js";

// ==========================
// 🧩 STEP 1: Send OTP
// ==========================
export const sendOtp = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    // ✅ Check if user already exists before sending OTP
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists!" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP in DB (expires automatically in 5 minutes)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // ✅ Build email content
    const html = `
      <div style="font-family:Arial;padding:20px;">
        <h2>Hey ${name || "there"} 👋</h2>
        <p>Your NoteZen verification code is:</p>
        <h1 style="color:#4f46e5;letter-spacing:3px;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `;

    // ✅ Send via Brevo REST API
    await sendEmailViaBrevo({
      to: email,
      subject: "Your NoteZen OTP",
      html,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// ==========================
// 🧾 STEP 2: Verify OTP
// ==========================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const record = await Otp.findOne({ email });
    if (!record)
      return res.status(400).json({ success: false, message: "OTP expired or not found" });

    if (record.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ OTP verify error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// ==========================
// 🧱 STEP 3: Register after OTP
// ==========================
export const registerAfterOtp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser)
      return res.status(409).json({ success: false, message: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const [newUser] = await User.create([{ name, email, password: hashed }], { session });
    await Otp.deleteOne({ email });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { token, user: newUser },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ registerAfterOtp Error:", error);
    next(error);
  }
};

// ==========================
// 🔐 SIGN IN
// ==========================
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { token, user },
    });
  } catch (error) {
    console.error("❌ Signin error:", error);
    next(error);
  }
};

// ==========================
// 🚪 SIGN OUT
// ==========================
export const signOut = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
