import { NextFunction, Request, Response } from "express";
import {
  loginBodySchema,
  registerBodySchema,
  taskBodySchema,
  sendOtpBodySchema,
  verifyOtpBodySchema,
  createTeamBodySchema,
  updateTeamBodySchema,
  resetPasswordBodySchema,
  inviteTeamMemberBodySchema,
  acceptInvitationBodySchema,
  verifyTempUserSchema,
} from "../common/zodSchema";
import { getZodErrors } from "../utils/helper.util";

//  Registration Body
export const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = registerBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
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
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
  }

  next();
};

// Reset Password Body
export const validateResetPasswordBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = resetPasswordBodySchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Email",
      error: getZodErrors(validate.error.errors),
    });
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
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
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
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
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
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
  }

  next();
};

//verify new password body
export const validateTempUserBody = (req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = verifyTempUserSchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
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
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
  }
  next();
};

// Update Team Body
export const validateUpdateTeamBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = updateTeamBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Inputs",
      error: getZodErrors(validate.error.errors),
    });
  }

  next();
};

export const validateInviteTeamMemberBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = inviteTeamMemberBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({
      message: "Email Address is required",
    });
  }

  next();
};

export const validateAcceptInvitationBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = acceptInvitationBodySchema.safeParse(req.body);

  if (!validate.success) {
    return res.status(400).json({
      message: "Missing Fields",
    });
  }

  next();
};
