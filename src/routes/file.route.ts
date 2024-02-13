import { Router } from "express";
import { teamsImageUploadUrl } from "../controllers/file.controller";

const router = Router();

//  Teams file Routes
router.get("/team", teamsImageUploadUrl);

export const fileRouter = router;
