import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import { rootRouter } from "./routes/index.route";

import connectDB from "./config/db.config";
connectDB();

const app: Express = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
