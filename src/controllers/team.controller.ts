import { Request, Response } from "express";
import { errorMessages, successMessages } from "../constants/messages";
import { Team } from "../models/Team.model";
import {
  createTeamBodySchema,
  updateTeamBodySchema,
} from "../common/zodSchema";
import z from "zod";
import {
  generateIdentifier,
  generateSlug,
  populateTeamsIconURL,
} from "../utils/helper.util";
import { User, UserType } from "../models/User.model";
import { deleteS3Object, getS3ObjectUrl } from "../common/s3";
import { InviteToken } from "../models/Invite.model";
import { randomBytes } from "crypto";
import { sendTeamInvitationEmail } from "../utils/mailSender.util";
import { error } from "console";
import mongoose from "mongoose";

const getTeamsController = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body.user;

    // Fetch teams of the user from DB
    const teamsBasic = await Team.find({ members: user._id }).populate(
      "members"
    );

    // Populate icon url
    const teams = await populateTeamsIconURL(teamsBasic);

    if (!teams)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    res.json({
      data: teams,
    });
  } catch (error) {
    return res.status(500).json({
      message: errorMessages.SOMETHING_WRONG,
    });
  }
};

const createTeamController = async (req: Request, res: Response) => {
  try {
    const { name, description, icon }: z.infer<typeof createTeamBodySchema> =
      req.body;

    const user: UserType = req.body.user;
    const userId = user._id;

    // Generate identifier
    const identifier = generateIdentifier(name);

    //  Generate Unique Slug
    const slug = await generateSlug(name);

    // Create new Team in the document
    const team = await Team.create({
      name,
      description,
      icon, //  TODO: integrate s3 links
      slug,
      identifier,
      owner: userId,
      members: [userId],
    });

    // If something went wrong while creating document then throw this
    if (!team)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    if (team.icon) {
      const preSignedUrl = await getS3ObjectUrl(team.icon);

      if (preSignedUrl) team.icon = preSignedUrl;
    }

    return res.json({ data: team });
  } catch (error) {
    res.status(500).json({
      message: errorMessages.SOMETHING_WRONG,
    });
  }
};

const deleteTeamController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //   Find and delete team by id
    const team = await Team.findByIdAndDelete(id);

    // if team doesn't exists then throw 404 error
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    if (team.icon) await deleteS3Object("team/" + team.icon);

    res.json({ message: successMessages.TEAM_DELETED, data: team });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: errorMessages.SOMETHING_WRONG,
    });
  }
};

const updateTeamController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Create payload
    const { name, description, icon }: z.infer<typeof updateTeamBodySchema> =
      req.body;

    // Find and update team
    const team = await Team.findByIdAndUpdate(
      id,
      {
        name,
        description,
        icon,
      },
      { new: true }
    );

    // If team doesn't exists then return 404
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    if (team.icon) {
      const preSignedUrl = await getS3ObjectUrl(team.icon);

      if (preSignedUrl) team.icon = preSignedUrl;
    }

    res.json({ data: team });
  } catch (error) {
    res.status(500).json({ message: errorMessages.SOMETHING_WRONG });
  }
};

// Invite Team Member
const inviteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id: teamId } = req.params;
    const { email } = req.body;

    // 1. Validate teamId
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    // 2. Check if email is a user
    const user = await User.findOne({ email });

    // 3. Check if team member already exists
    if (user) {
      const isMember = await Team.findOne({
        _id: teamId,
        members: { $elemMatch: { $eq: user._id } },
      });
      if (isMember)
        return res.status(400).json({ message: errorMessages.ALREADY_MEMBER });
    }

    // 4. Generate unique invite token
    const inviteToken = randomBytes(64).toString("hex");
    const invite = await InviteToken.findOneAndUpdate(
      { email },
      { email, inviteToken, teamId, used: false },
      { upsert: true, new: true }
    );

    // 5. Create Invitation URL
    const invitationUrl =
      process.env.TEAM_INVITE_CALLBACK +
      `${teamId}?email=${email}&invite-token=${invite?.inviteToken}`;

    // 6. Send invitation mail with the invitation url
    await sendTeamInvitationEmail(email, team.name, invitationUrl);

    res.json({ data: invitationUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: errorMessages.SOMETHING_WRONG, error });
  }
};

// Accept Team Invitation
const acceptTeamInvitation = async (req: Request, res: Response) => {
  try {
    const { id: teamId } = req.params;
    const { email, inviteToken } = req.body;

    // 1. Validate teamId
    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: errorMessages.USER_NOT_FOUND });

    // 3. Check if is already a team member
    const isMember = await Team.findOne({
      _id: teamId,
      members: { $elemMatch: { $eq: user._id } },
    });
    console.log(isMember);
    if (isMember)
      return res.status(400).json({ message: errorMessages.ALREADY_MEMBER });

    // 4. verify invite token
    const invite = await InviteToken.findOne(
      { email, inviteToken },
      { used: true }
    );
    if (!invite)
      return res
        .status(404)
        .json({ message: errorMessages.INVALID_INVITATION });

    const updatedTeam = await Team.findOneAndUpdate(
      { _id: teamId },
      { $push: { members: user._id } },
      { new: true }
    );

    res.json({ data: updatedTeam });
  } catch (error) {
    return res
      .status(500)
      .json({ message: errorMessages.SOMETHING_WRONG, error });
  }
};

export {
  getTeamsController,
  createTeamController,
  deleteTeamController,
  updateTeamController,
  inviteTeamMember,
  acceptTeamInvitation,
};
