import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["signup", "login"],
      required: true,
    },
    attempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

otpSchema.index({ phone: 1, purpose: 1, isVerified: 1 });

export const OTP = mongoose.model("OTP", otpSchema);
