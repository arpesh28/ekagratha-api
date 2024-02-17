import otpGenerator from "otp-generator";
import { OTP } from "../models/Otp.model";
import { Request, Response } from "express";
import { User } from "../models/User.model";
import jwt from "jsonwebtoken";
import { errorMessages, successMessages } from "../constants/messages";
import crypto from "crypto";
import { ResetPasswordToken } from "../models/ResetPasswordToken.model";
import { bcryptPassword, comparePasswords } from "../common/bcrypt";
const sendResetPasswordOTPController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        req.body.isReset = true;
        console.log("NEW BODY", req.body)

        // Check if user exist or not
        const existingUser = await User.findOne({ email });

        // If user found with provided email
        if (!existingUser) {
            return res.status(404).json({
                message: errorMessages.EMAIL_NOT_FOUND,
            });
        }
        // Find the most recent OTP sent to the user
        const existingOTP = await OTP.findOne({ email }).sort({ sentDate: -1 });
        // Check if an OTP exists and if it was sent recently
        if (existingOTP && (Date.now() - existingOTP.sentDate.getTime()) < 300000) { // Within the last 5 minutes (300000 milliseconds)
            return res.status(400).json({
                message: errorMessages.OTP_ALREADY_SENT,
            });
        }
        else {
            // Time has passed delete the existing and create new 
            await OTP.findOneAndDelete({ email })
            //  Generate OTP
            let otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            });
            const result = await OTP.create({
                email,
                otp,
                isReset: req.body.isReset
            });

            result.save(req.body);

            if (!result)
                return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

            return res.json({
                message: successMessages.OTP_SENT,
            });
        }

    } catch (error: any) {
        return res
            .status(500)
            .json({ message: errorMessages.SOMETHING_WRONG, error: error.message, });
    }
};

const verifyResetPasswordOTPController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        // Check if user exist or not
        const existingUser = await User.findOne({ email });

        // If user not found with provided email
        if (!existingUser) {
            return res.status(404).json({
                message: errorMessages.EMAIL_NOT_FOUND,
            });
        }

        // Find the most recent OTP sent to the user
        const latestOTP = await OTP.findOne({ email }).sort({ sentDate: -1 });

        // If no OTP is found or the OTP is expired
        if (!latestOTP || (Date.now() - latestOTP.sentDate.getTime()) > 300000) { // OTP expires after 5 minutes (300000 milliseconds)
            return res.status(404).json({
                message: errorMessages.NO_ACTIVE_OTP,
            });
        }

        // Verify the OTP
        if (latestOTP.otp !== otp) {
            return res.status(403).json({
                message: errorMessages.INVALID_OTP,
            });
        }
        // Generate temporary token
        const tempToken = crypto.randomBytes(32).toString("hex");
        const tempTokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires after 24 hours
        await ResetPasswordToken.create(
            {
                email: req.body.email,
                tempToken: tempToken,
            }
        )
        await OTP.findOneAndDelete({ email: req.body.email })
        res.status(200).json({ message: successMessages.OTP_VERIFIED, tempToken });

    } catch (error: any) {
        return res
            .status(500)
            .json({ message: errorMessages.SOMETHING_WRONG, error: error.message });
    }
};
const newPasswordController = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword, tempToken } = req.body;
        const tempUser = await ResetPasswordToken.findOne({ tempToken });
        if (!tempUser) {
            return res.status(404).json({
                message: errorMessages.USER_NOT_FOUND,
            });
        }
        const existingUser = await User.findOne({ email: tempUser?.email });
        const existingPassword: any = existingUser?.password

        // If user not found with provided email
        if (!existingUser) {
            return res.status(404).json({
                message: errorMessages.EMAIL_NOT_FOUND,
            });
        }
        const validPass: any = await comparePasswords(
            oldPassword, existingPassword
        );
        if (!validPass)
            return res
                .status(401)
                .json({ message: errorMessages.INVALID_CREDENTIALS });

        const newPassHash: string = bcryptPassword(newPassword);
        await User.findOneAndUpdate(
            { email: tempUser?.email },
            { password: newPassHash }
        )
        await ResetPasswordToken.findOneAndDelete({ tempToken })
        res.status(200).json({ message: successMessages.PASSWORD_CHANGED, newPassHash });
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: errorMessages.SOMETHING_WRONG, error: error.message });
    }
};
export { sendResetPasswordOTPController, verifyResetPasswordOTPController, newPasswordController };
