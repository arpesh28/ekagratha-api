import { User, UserType } from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorMessages } from "../constants/messages";
import { Team } from "../models/Team.model";

async function isTeamOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const owner: UserType = req.body.user;
    const { id: teamId } = req.params;

    // 1. Validate teamId
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    // 2. Check if the owner of the team is requesting or not
    if (!team.owner._id.equals(owner._id))
      return res.status(403).json({ message: errorMessages.NOT_TEAM_OWNER });

    req.body.team = team;

    next();
  } catch (error) {
    return res.status(401).json({ message: errorMessages.UNAUTHORIZED });
  }
}

async function isTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member: UserType = req.body.user;
    const { id: teamId } = req.params;

    // 1. Validate teamId
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    // 2. Check if the user is a member of the team
    const isMember = await Team.findOne({
      _id: teamId,
      members: { $elemMatch: { $eq: member._id } },
    });
    if (!isMember)
      return res.status(403).json({ message: errorMessages.NOT_MEMBER });

    req.body.team = team;

    next();
  } catch (error) {
    return res.status(401).json({ message: errorMessages.UNAUTHORIZED });
  }
}

export { isTeamMember, isTeamOwner };
