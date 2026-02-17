import { Router } from "express";
import { sendOTP, verifySignupOTP, verifyLoginOTP } from "../controllers/otp.controller";
import { otpSendLimiter, otpVerifyLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/send", otpSendLimiter, sendOTP);
router.post("/verify-signup", otpVerifyLimiter, verifySignupOTP);
router.post("/verify-login", otpVerifyLimiter, verifyLoginOTP);

export default router;
