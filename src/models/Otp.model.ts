import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/mailSender.util";

const otpSchema = new Schema({
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
  createdAt: { type: Date, expires: 60, default: Date.now },
});

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
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export { OTP };
