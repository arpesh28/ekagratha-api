import mongoose, { Document, InferSchemaType, Schema } from "mongoose";
import { Providers } from "../typings/enum";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      kMaxLength: 50,
    },
    password: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      required: true,
      enum: Object.values(Providers),
      default: Providers.Email,
    },
    providerUserId: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    personalTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  },
  { timestamps: true }
);

type UserType = InferSchemaType<typeof userSchema> & {
  _id: Document["_id"];
  // createdAt: Document["createdAt"];
};

const User = mongoose.model("User", userSchema);
export { User, UserType };
