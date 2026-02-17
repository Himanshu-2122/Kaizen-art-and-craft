import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import { generateTokens } from "./auth.controller";
import {
  generateOTP,
  OTP_EXPIRY_MINUTES,
  MAX_VERIFY_ATTEMPTS,
  MAX_OTP_PER_HOUR,
  verifyOTPCode,
} from "../utils/otp";

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone, purpose } = req.body;

    if (!phone || !purpose) {
      return res.status(400).json({ message: "Phone and purpose are required" });
    }

    if (purpose !== "signup" && purpose !== "login") {
      return res.status(400).json({ message: "Purpose must be 'signup' or 'login'" });
    }

    if (purpose === "signup") {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }

    if (purpose === "login") {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: "No account found with this phone number" });
      }
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await OTP.countDocuments({
      phone,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentCount >= MAX_OTP_PER_HOUR) {
      return res.status(429).json({ message: "Too many OTP requests. Please try again later." });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OTP.create({ phone, code, purpose, expiresAt });

    // TODO: Replace with real SMS provider (e.g. Twilio)
    console.log(`[OTP] Phone: ${phone} | Code: ${code} | Purpose: ${purpose} | Expires: ${OTP_EXPIRY_MINUTES}min`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifySignupOTP = async (req: Request, res: Response) => {
  try {
    const { phone, code, fullName, username, email, password } = req.body;

    if (!phone || !code || !fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otp = await OTP.findOne({
      phone,
      purpose: "signup",
      isVerified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otp) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
      return res.status(400).json({ message: "Maximum verification attempts exceeded. Please request a new OTP." });
    }

    otp.attempts += 1;
    await otp.save();

    if (!verifyOTPCode(otp.code, code)) {
      const remaining = MAX_VERIFY_ATTEMPTS - otp.attempts;
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
    }

    otp.isVerified = true;
    await otp.save();

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashed,
      role: "user",
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Verify signup OTP error:", err);
    res.status(500).json({ message: "Signup verification failed" });
  }
};

export const verifyLoginOTP = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ message: "Phone and OTP code are required" });
    }

    const otp = await OTP.findOne({
      phone,
      purpose: "login",
      isVerified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otp) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
      return res.status(400).json({ message: "Maximum verification attempts exceeded. Please request a new OTP." });
    }

    otp.attempts += 1;
    await otp.save();

    if (!verifyOTPCode(otp.code, code)) {
      const remaining = MAX_VERIFY_ATTEMPTS - otp.attempts;
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
    }

    otp.isVerified = true;
    await otp.save();

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error("Verify login OTP error:", err);
    res.status(500).json({ message: "Login verification failed" });
  }
};
