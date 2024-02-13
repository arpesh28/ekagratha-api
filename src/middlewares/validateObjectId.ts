import { NextFunction, Request, Response } from "express";
import { errorMessages } from "../constants/messages";
import mongoose from "mongoose";

export const checkForObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: errorMessages.INVALID_ID });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: errorMessages.INVALID_ID });

  next();
};
