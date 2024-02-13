import { Router } from "express";
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

router.get("/", getTeamsController); // Fetch user's all teams
router.post("/", validateCreateTeamBody, createTeamController); // Create a new team
router.put(
  "/:id",
  checkForObjectId,
  validateUpdateTeamBody,
  updateTeamController
); // Update an existing team
router.delete("/:id", checkForObjectId, deleteTeamController); // Delete an existing team

export const teamRouter = router;
