import { Express, Request, Response, Router } from "express";
import { validateRegisterBody } from "../middlewares/bodyValidation.middleware";
import { User } from "../models/User.model";
import jwt from "jsonwebtoken";
import { bcryptPassword } from "../controllers/auth.controller";
const router = Router();

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

router.post("/login", (req: Request, res: Response) => {
  res.json({
    message: "Hello Log",
  });
});

export const authRouter = router;
