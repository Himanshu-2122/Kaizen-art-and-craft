import crypto from "crypto";

export const OTP_EXPIRY_MINUTES = 5;
export const MAX_VERIFY_ATTEMPTS = 3;
export const MAX_OTP_PER_HOUR = 5;

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const verifyOTPCode = (storedCode: string, inputCode: string): boolean => {
  if (storedCode.length !== inputCode.length) return false;

  const storedBuf = Buffer.from(storedCode, "utf-8");
  const inputBuf = Buffer.from(inputCode, "utf-8");

  return crypto.timingSafeEqual(storedBuf, inputBuf);
};
