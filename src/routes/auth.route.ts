import { Router } from "express";
import {
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
router.post("/register", validateRegisterBody, registerController);
router.post("/login", validateLoginBody, loginController);

//  Google Auth Routes
router.get("/google/url", googleAuthGetURLController);
router.get("/google/callback");

export const authRouter = router;
