import express, { Express } from "express";
import { rootRouter } from "./routes/index.route";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
