// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import { rootRouter } from "./routes/index.route";

// import connectDB from "./config/db.config";
// connectDB();

// const app: Express = express();

// app.use(express.json());

// app.use("/api/v1", rootRouter);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// const PORT = process.env.PORT || 8001;

// app.listen(PORT, () => {
//   console.log("Running on port: ", PORT);
// });

import express, { Express, Request, Response } from "express";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log("Running on port: ", PORT);
});
