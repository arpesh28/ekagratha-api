import otpGenerator from "otp-generator";
import { OTP } from "../models/Otp.model";
import { Request, Response } from "express";
import { User } from "../models/User.model";
import jwt from "jsonwebtoken";
import { errorMessages } from "../constants/messages";

const sendOTPController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exist or not
    const existingUser = await User.findOne({ email });

    // If user found with provided email
    if (!existingUser) {
      return res.status(404).json({
        message: errorMessages.EMAIL_NOT_FOUND,
      });
    }

    if (existingUser.isVerified) {
      return res.status(400).json({
        message: errorMessages.EMAIL_ALREADY_VERIFIED,
      });
    }

    let existingEmail = await OTP.findOne({ email });
    if (existingEmail) return res.json({ message: "OTP already sent!" });

    //  Generate OTP
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    let existingOTP = await OTP.findOne({ otp });
    while (existingOTP) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      existingOTP = await OTP.findOne({ otp: otp });
    }

    const result = await OTP.create({
      email,
      otp,
    });

    result.save();

    if (!result)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    res.json({
      message: "OTP send successfully",
    });
  } catch (error: any) {
    console.log(error?.message);
    return res
      .status(500)
      .json({ message: errorMessages.SOMETHING_WRONG, error: error.message });
  }
};

const verifyOTPController = async (req: Request, res: Response) => {
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

    //  Find the OTP document
    const existingOTP = await OTP.findOne({ email });

    //  If otp document not found
    if (!existingOTP)
      return res.status(404).json({
        message: errorMessages.NO_ACTIVE_OTP,
      });

    const currentTime = Date.now();
    const elapsedOtpTime = Math.floor(
      (currentTime - existingOTP.sentDate.getTime()) / 1000
    );
    if (elapsedOtpTime > 300)
      return res.status(401).send({ message: errorMessages.OTP_EXPIRED });

    if (existingOTP)
      if (existingOTP.otp !== otp)
        return res.status(403).json({
          message: errorMessages.INVALID_OTP,
        });

    const newUserData = await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    if (!newUserData)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    await OTP.deleteOne({ email });

    const token = jwt.sign(
      {
        email: newUserData.email,
        name: newUserData.name,
        _id: newUserData._id,
      },
      process.env.JWT_SECRET!
    );

    res.json({
      data: {
        user: {
          email: newUserData.email,
          name: newUserData.name,
          _id: newUserData._id,
          provider: newUserData.provider,
          isVerified: newUserData.isVerified,
        },
        token,
      },
    });
  } catch (error: any) {
    console.log(error?.message);
    return res
      .status(500)
      .json({ message: errorMessages.SOMETHING_WRONG, error: error.message });
  }
};

export { sendOTPController, verifyOTPController };
