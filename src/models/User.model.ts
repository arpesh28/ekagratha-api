import mongoose, { Schema } from "mongoose";

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
      required: true,
    },
    personalTasks:[
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' 
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export { User };
