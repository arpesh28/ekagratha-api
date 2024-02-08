import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../middlewares/bodyValidation.middleware";

const router = Router();

// Auth Routes
router.post("/register", validateRegisterBody, registerController);
router.post("/login", validateLoginBody, loginController);

export const authRouter = router;
