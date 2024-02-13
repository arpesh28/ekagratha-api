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
import { checkForObjectId } from "../middlewares/validateObjectId";

const router = Router();

// Fetch All My Teams
router.get("/", getTeamsController);
router.post("/", validateCreateTeamBody, createTeamController);
router.put(
  "/:id",
  checkForObjectId,
  validateUpdateTeamBody,
  updateTeamController
);
router.delete("/:id", checkForObjectId, deleteTeamController);

export const teamRouter = router;
