import { Express, Request, Response, Router } from "express";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../middlewares/bodyValidation.middleware";
import { User } from "../models/User.model";
import jwt from "jsonwebtoken";
import {
  bcryptPassword,
  comparePasswords,
} from "../controllers/auth.controller";
const router = Router();

// Register Endpoint
router.post(
  "/register",
  validateRegisterBody,
  async (req: Request, res: Response) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) return res.json({ message: "Email already exists!" });

    const hashPassword = bcryptPassword(req.body.password);
    const user = await User.create({
      name: req.body.name,
      password: hashPassword,
      email: req.body.email,
    });

    if (!user) return res.json({ message: "Something went wrong" });

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET!
    );
    res.json({
      data: {
        user: { email: user.email, _id: user._id, name: user.name },
        token,
      },
    });
  }
);

router.post(
  "/login",
  validateLoginBody,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ message: "Email not found!" });

    const validPass: boolean = await comparePasswords(
      req.body.password,
      user.password
    );
    if (!validPass)
      return res.status(401).json({ message: "Email/Password is incorrect" });

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!
    );

    res.json({
      data: {
        user: { email: user.email, name: user.name, _id: user._id },
        token,
      },
    });
  }
);

export const authRouter = router;
