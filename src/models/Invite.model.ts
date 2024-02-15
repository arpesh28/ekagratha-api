import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/mailSender.util";

const inviteSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    inviteToken: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true }
);

// Define a function to send emails
// async function sendVerificationEmail(email: string, otp: string) {
//   try {
//     const mailResponse = await mailSender(
//       email,
//       "Verify your email address",
//       `<h1>Please confirm your OTP</h1>
//        <p>Here is your OTP code: ${otp}</p>`
//     );
//     console.log("Email sent successfully: ", mailResponse);
//   } catch (error) {
//     console.log("Error occurred while sending email: ", error);
//     throw error;
//   }
// }

// inviteSchema.pre("save", async function (next) {
//   console.log("New document saved to the database");
//   // Only send an email when a new document is created
//   if (this.isNew) {
//     await sendVerificationEmail(this.email, this.);
//   }
//   next();
// });

const InviteToken = mongoose.model("InviteToken", inviteSchema);
export { InviteToken };
