import { Request, Response } from "express";
import { errorMessages } from "../constants/messages";

const teamsImageUploadUrl = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });
  }
};

export { teamsImageUploadUrl };
