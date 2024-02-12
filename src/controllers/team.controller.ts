import { Request, Response } from "express";
import { errorMessages } from "../constants/messages";
import { Team } from "../models/Team.model";
import { UserType } from "../typings/types";

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

const createTeamController = async (req: Request, res: Response) => {};

const deleteTeamController = async (req: Request, res: Response) => {};

const updateTeamController = async (req: Request, res: Response) => {};

export {
  getTeamsController,
  createTeamController,
  deleteTeamController,
  updateTeamController,
};
