import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { rootRouter } from "./routes/index.route";
dotenv.config();

import connectDB from "./config/db.config";
connectDB();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log("Running on port: ", PORT);
});
