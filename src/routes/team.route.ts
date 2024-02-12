import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createTeamController,
  deleteTeamController,
  getTeamsController,
  updateTeamController,
} from "../controllers/team.controller";
import { validateCreateTeamBody } from "../middlewares/bodyValidation.middleware";

const router = Router();

// Fetch All My Teams
router.get("/", getTeamsController);
router.post("/", validateCreateTeamBody, createTeamController);
router.put("/:teamId", updateTeamController);
router.delete("/:teamId", deleteTeamController);

export const teamRouter = router;
