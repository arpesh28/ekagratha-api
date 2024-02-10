import { User } from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AUTH_SECRET: string | undefined = process.env.JWT_SECRET;

export default async function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (AUTH_SECRET === undefined) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  const token = req.headers.authorization;
  const jwtToken = token?.split(" ")[1];
  if (!token || !jwtToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const data = jwt.verify(jwtToken, AUTH_SECRET);
    const user = await User.findOne({
      email: typeof data === "string" ? "" : data?.email,
    });    
    if (!user) return res.status(404).json({ message: "User not found" });
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}