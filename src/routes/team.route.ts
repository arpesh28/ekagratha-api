import { Router } from "express";
import {
  createTeamController,
  deleteTeamController,
  getTeamsController,
  inviteTeamMember,
  updateTeamController,
} from "../controllers/team.controller";
import {
  validateCreateTeamBody,
  validateInviteTeamMemberBody,
  validateUpdateTeamBody,
} from "../middlewares/bodyValidation.middleware";
import { checkForObjectId } from "../middlewares/paramsValidation.middleware";

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

// Team Management
router.post(
  "/invite/:id",
  checkForObjectId,
  validateInviteTeamMemberBody,
  inviteTeamMember
);

export const teamRouter = router;
