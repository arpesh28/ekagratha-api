import { Request, Response } from "express";
import { User } from "../models/User.model";
import { bcryptPassword, comparePasswords } from "../config/helpers";
import jwt from "jsonwebtoken";

const registerController = async (req: Request, res: Response) => {
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
};

const loginController = async (req: Request, res: Response) => {
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
};

export { registerController, loginController };
