import { NextFunction, Request, Response } from "express";
import { errorMessages } from "../constants/messages";
import mongoose from "mongoose";

export const checkForTeamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { teamId } = req.params;
  if (!teamId)
    return res.status(400).json({ message: errorMessages.TEAM_ID_REQUIRED });

  if (!mongoose.Types.ObjectId.isValid(teamId))
    return res.status(400).json({ message: errorMessages.INVALID_ID });

  next();
};
