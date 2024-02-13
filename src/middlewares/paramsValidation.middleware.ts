import { NextFunction, Request, Response } from "express";
import { errorMessages } from "../constants/messages";
import mongoose from "mongoose";
import { imageUploadUrlParamsSchema } from "../common/zodSchema";
import { getZodErrors } from "../utils/helper.util";

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

export const validateFileUploadParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category, filename, fileType } = req.params;

  if (!category || !filename || !fileType)
    return res.status(400).json({ message: errorMessages.BAD_REQUEST });

  const validate = imageUploadUrlParamsSchema.safeParse(req.params);

  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
  }

  next();
};
