import { Router } from "express";
import {
  discordAuthCallbackController,
  discordAuthGetURLController,
  googleAuthCallbackController,
  googleAuthGetURLController,
  loginController,
  registerController,
} from "../controllers/auth.controller";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../middlewares/bodyValidation.middleware";

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

export const authRouter = router;
