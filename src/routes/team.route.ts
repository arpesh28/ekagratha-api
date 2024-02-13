import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createTeamController,
  deleteTeamController,
  getTeamsController,
  updateTeamController,
} from "../controllers/team.controller";
import {
  validateCreateTeamBody,
  validateUpdateTeamBody,
} from "../middlewares/bodyValidation.middleware";
import { checkForTeamId } from "../middlewares/team.middleware";

const router = Router();

// Fetch All My Teams
router.get("/", getTeamsController);
router.post("/", validateCreateTeamBody, createTeamController);
router.put(
  "/:teamId",
  checkForTeamId,
  validateUpdateTeamBody,
  updateTeamController
);
router.delete("/:teamId", checkForTeamId, deleteTeamController);

export const teamRouter = router;
