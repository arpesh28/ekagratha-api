import express, { Router, Express } from "express";

const app: Express = express();

app.use(express.json());

// app.use('/api)

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
