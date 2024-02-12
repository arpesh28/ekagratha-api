import mongoose, { Schema } from "mongoose";
import { PriorityEnum } from "../typings/enum";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      kMaxLength: 100,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [String],
    priority: {
      type: String,
      enum: PriorityEnum,
      default: 'Medium'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export { Task }