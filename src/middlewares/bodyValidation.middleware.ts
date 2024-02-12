import { NextFunction, Request, Response } from "express";
import {
  loginBodySchema,
  registerBodySchema,
  taskBodySchema,
  sendOtpBodySchema,
  verifyOtpBodySchema,
  createTeamBodySchema,
} from "../config/zodSchema.config";

const getZodErrors = (errors: any) => {
  return errors?.reduce(
    (acc: any, err: { path: number[]; message: string }) => {
      acc[err.path[0]] = err.message;
      return acc;
    },
    {}
  );
};

//  Registration Body
export const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = registerBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }

  next();
};

//  Login Body
export const validateLoginBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = loginBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }

  next();
};

//  Personal Task body
export const validateTaskBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = taskBodySchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }
  next();
};

//  Send OTP Body
export const validateSendOtpBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = sendOtpBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }

  next();
};

//  Verify OTP Body
export const validateVerifyOtpBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = verifyOtpBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }

  next();
};

// Create Team Body
export const validateCreateTeamBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = createTeamBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json(getZodErrors(validate.error.errors));
  }

  next();
};
