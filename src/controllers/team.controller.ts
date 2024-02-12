import { Request, Response } from "express";
import { errorMessages, successMessages } from "../constants/messages";
import { Team } from "../models/Team.model";
import { UserType } from "../typings/types";
import { createTeamBodySchema } from "../config/zodSchema.config";
import z from "zod";
import { generateIdentifier, generateSlug } from "../utils/helper.util";
import mongoose from "mongoose";

const getTeamsController = async (req: Request, res: Response) => {
  try {
    const user: UserType = req.body;

    const teams = await Team.find({ members: user._id });
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

    // Generate identifier
    const identifier = generateIdentifier(name);

    //  Generate Unique Slug
    const slug = await generateSlug(name);

    console.log(name, slug);

    // Create new Team in the document
    const team = await Team.create({
      name,
      description,
      icon, //  TODO: integrate s3 links
      slug,
      identifier,
      owner: user?._id,
    });

    // If something went wrong while creating document then throw this
    if (!team)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    return res.json({ data: team });
  } catch (error) {
    res.status(500).json({
      message: errorMessages.SOMETHING_WRONG,
    });
  }
};

const deleteTeamController = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    if (!teamId)
      return res.status(400).json({ message: errorMessages.TEAM_ID_REQUIRED });

    if (!mongoose.Types.ObjectId.isValid(teamId))
      return res.status(400).json({ message: errorMessages.INVALID_ID });

    //   Find and delete team by id
    const team = await Team.findByIdAndDelete(teamId);

    // if team doesn't exists then throw 404 error
    if (!team)
      return res.status(404).json({ message: errorMessages.TEAM_NOT_FOUND });

    res.json({ message: successMessages.TEAM_DELETED, data: team });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: errorMessages.SOMETHING_WRONG,
    });
  }
};

const updateTeamController = async (req: Request, res: Response) => {};

export {
  getTeamsController,
  createTeamController,
  deleteTeamController,
  updateTeamController,
};
