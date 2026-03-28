const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      maxLength: 6,
      match: [/^\d{6}$/, "OTP must be 6 digits"],
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);