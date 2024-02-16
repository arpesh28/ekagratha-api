import { Router } from "express";
import {
  acceptTeamInvitation,
  createTeamController,
  deleteTeamController,
  getAllTeamMembers,
  getTeamsController,
  inviteTeamMember,
  removeTeamMember,
  updateTeamController,
} from "../controllers/team.controller";
import {
  validateCreateTeamBody,
  validateInviteTeamMemberBody,
  validateUpdateTeamBody,
} from "../middlewares/bodyValidation.middleware";
import {
  checkForObjectId,
  checkRemoveTeamMemberObjectId,
} from "../middlewares/paramsValidation.middleware";
import { isTeamOwner, isTeamMember } from "../middlewares/team.middleware";

const router = Router();

router.get("/", getTeamsController); // Fetch user's all teams
router.post("/", validateCreateTeamBody, createTeamController); // Create a new team
router.put(
  "/:id",
  checkForObjectId,
  isTeamOwner,
  validateUpdateTeamBody,
  updateTeamController
); // Update an existing team
router.delete("/:id", checkForObjectId, isTeamOwner, deleteTeamController); // Delete an existing team

// Team Management
router.post(
  "/invite/:id",
  checkForObjectId,
  isTeamOwner,
  validateInviteTeamMemberBody,
  inviteTeamMember
); // Invite a new member
router.post(
  "/accept-invitation/:id",
  checkForObjectId,
  validateInviteTeamMemberBody,
  acceptTeamInvitation
); // Accept team invitation
router.delete(
  "/remove-member/:id/:userId",
  checkRemoveTeamMemberObjectId,
  isTeamOwner,
  removeTeamMember
); // remove a team member

router.get("/members/:id", checkForObjectId, isTeamMember, getAllTeamMembers); // remove a team member

export const teamRouter = router;
