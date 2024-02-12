import { User } from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorMessages } from "../constants/messages";

const AUTH_SECRET: string = process.env.JWT_SECRET! as string;
export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (AUTH_SECRET === undefined) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  const token = req.headers.authorization;
  const jwtToken = token?.split(" ")[1];
  if (!jwtToken)
    return res.status(401).json({ message: errorMessages.UNAUTHORIZED });

  try {
    const data = jwt.verify(jwtToken, AUTH_SECRET) as JwtPayload;

    const user = await User.findById(data._id);
    if (!user || !user._id)
      return res.status(404).json({ message: errorMessages.UNAUTHORIZED });

    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: errorMessages.UNAUTHORIZED });
  }
}
