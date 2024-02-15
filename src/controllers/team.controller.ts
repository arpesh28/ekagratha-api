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
import { UserType } from "../models/User.model";
import { deleteS3Object, getS3ObjectUrl } from "../common/s3";
import { InviteToken } from "../models/Invite.model";
import { randomBytes } from "crypto";

const getTeamsController = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body.user;

    // Fetch teams of the user from DB
    const teamsBasic = await Team.find({ members: user._id });

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

    // 2. Check if team member already exists
    const isMember = await Team.findOne({ email });
    if (isMember)
      return res.status(400).json({ message: errorMessages.ALREADY_MEMBER });

    // 3. Generate unique invite token
    const inviteToken = randomBytes(64).toString("hex");
    console.log("Checkpoint", inviteToken);
    const invite = await InviteToken.findOneAndUpdate(
      { email },
      { email, inviteToken, teamId, used: false },
      { upsert: true, new: true }
    );

    const invitationUrl =
      process.env.TEAM_INVITE_CALLBACK +
      `${teamId}?email=${email}&invite-token=${invite?.inviteToken}`;

    res.json({ data: invitationUrl });
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
};
