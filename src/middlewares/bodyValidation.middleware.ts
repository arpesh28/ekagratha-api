import { NextFunction, Request, Response, Router } from "express";
import {
  loginBodySchema,
  registerBodySchema,
  taskBodySchema,
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
export const validateTaskBody=(
  req: Request,
  res: Response,
  next: NextFunction
) =>{
  const validate =taskBodySchema.safeParse(req.body);
  if(!validate.success){
    return res.status(400).json(getZodErrors(validate.error.errors));
  }
  next();
}
