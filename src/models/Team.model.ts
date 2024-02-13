import mongoose, { Document, InferSchemaType, Schema } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

type TeamType = InferSchemaType<typeof teamSchema> & {
  _id: Document["_id"];
  // createdAt: Document["createdAt"];
};
const Team = mongoose.model("Team", teamSchema);
export { Team, TeamType };
