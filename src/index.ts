import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { rootRouter } from "./routes/index.route";
import cors from "cors";

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
