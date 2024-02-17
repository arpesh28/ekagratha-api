import mongoose, { Schema } from "mongoose";
import { mailSender } from "../utils/mailSender.util";

const ResetPasswordTokenSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        tempToken: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);
const ResetPasswordToken = mongoose.model("ResetPasswordToken", ResetPasswordTokenSchema);
export { ResetPasswordToken };
