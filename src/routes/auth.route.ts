import { Router } from "express";
import {
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

export const authRouter = router;
