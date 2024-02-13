import { Router } from "express";
import { imageUploadUrl } from "../controllers/file.controller";
import { validateFileUploadParams } from "../middlewares/paramsValidation.middleware";

const router = Router();

//  Teams file Routes
router.get(
  "/:category/:filename/:fileType",
  validateFileUploadParams,
  imageUploadUrl
);

export const fileRouter = router;
