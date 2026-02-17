import rateLimit from "express-rate-limit";

export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many OTP requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many verification attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
