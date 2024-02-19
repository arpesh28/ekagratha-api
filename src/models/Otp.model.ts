import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/mailSender.util";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isReset: {
      type: Boolean,
      default: false
    },
    sentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Define a function to send reset password emails
async function sendResetPasswordEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailSender(
      email,
      "Reset your password",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
  } catch (error) {
    throw error;
  }
}

// Define a function to send emails
async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verify your email address",
      `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  // Only send an email when a new document is created
  console.log("THIS", this)

  if (this.isReset) {
    await sendResetPasswordEmail(this.email, this.otp);
  }
  else {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
const OTP = mongoose.model("OTP", otpSchema);
export { OTP };
