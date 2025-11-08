import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// Temporary OTP store (replace with Redis or DB in prod)
const otpStore = new Map();

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min

    otpStore.set(email, { otp, expiry, name });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NoteZen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your NoteZen Signup OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Welcome to NoteZen, ${name || "there"} 👋</h2>
          <p>Use this OTP to complete your signup:</p>
          <h1 style="color:#ff4d6d;">${otp}</h1>
          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// ✅ Verify OTP (and create user)
export const verifyOtp = async (req, res) => {
  try {
    const { name, email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record) return res.status(400).json({ message: "OTP not sent or expired" });
    if (record.expiry < Date.now()) return res.status(400).json({ message: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    otpStore.delete(email);

    // Create user if not exist
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || record.name || email.split("@")[0],
        email,
        password: "OTP_LOGIN_USER", // dummy
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: { token, user },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};
