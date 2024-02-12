import mongoose from "mongoose";
import { PriorityEnum } from "../typings/enum";

export type ProviderUserProfile = {
  sub: string;
  name: string;
  email: string;
  username?: string;
  id?: string;
};
export type PersonalTask = {
  title: string;
  description?: string;
  tags?: string[];
  priority?: PriorityEnum;
  userId: mongoose.Types.ObjectId;
};

export type UserType = {
  email: string;
  _id: string;
  name: string;
};
