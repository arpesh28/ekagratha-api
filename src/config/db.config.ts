import mongoose, { mongo } from "mongoose";

mongoose.connect(process.env.DB_URL!);
