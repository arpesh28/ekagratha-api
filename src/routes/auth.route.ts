import { Router } from "express";
import {
  discordAuthCallbackController,
  discordAuthGetURLController,
  githubAuthCallbackController,
  githubAuthGetURLController,
  googleAuthCallbackController,
  googleAuthGetURLController,
  loginController,
  registerController,
  resetPasswordController,
} from "../controllers/auth.controller";
import {
  validateLoginBody,
  validateRegisterBody,
  validateResetPasswordBody,
  validateSendOtpBody,
  validateTempUserBody,
  validateVerifyOtpBody,
} from "../middlewares/bodyValidation.middleware";
import {
  sendOTPController,
  verifyOTPController,
} from "../controllers/otp.controller";
import { newPasswordController, sendResetPasswordOTPController, verifyResetPasswordOTPController } from "../controllers/resetPassword.controller";

const router = Router();

// Local Auth Routes
router.post("/register", validateRegisterBody, registerController); // Local Register Route
router.post("/login", validateLoginBody, loginController); // Local Login Route

//  Google Auth Routes
router.get("/google/url", googleAuthGetURLController); // Get Google auth url with client id and redirect url
router.get("/google/callback", googleAuthCallbackController); // Get Google access token using code and save the user profile to DB

//  Discord Auth Routes
router.get("/discord/url", discordAuthGetURLController); // Get Discord auth url with client id and redirect url
router.get("/discord/callback", discordAuthCallbackController); // Get Discord access token using code and save the user profile to DB

//  Github Auth Routes
router.get("/github/url", githubAuthGetURLController); // Get Github auth url with client id and redirect url
router.get("/github/callback", githubAuthCallbackController); // Get Github access token using code and save the user profile to DB

// Email Verification Routes
router.post("/send-otp", validateSendOtpBody, sendOTPController); // Send OTP to email for verification
router.post("/verify-otp", validateVerifyOtpBody, verifyOTPController); // Verify OTP for email verification

//Password Verification
router.post("/reset-password/send-otp", validateResetPasswordBody, resetPasswordController, validateSendOtpBody, sendResetPasswordOTPController)
router.post("/reset-password/verify-otp", validateVerifyOtpBody, verifyResetPasswordOTPController)
router.post("/reset-password/new-password", validateTempUserBody, newPasswordController)

export const authRouter = router;
