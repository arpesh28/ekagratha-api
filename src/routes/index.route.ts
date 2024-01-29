import { Express, Router } from "express";
import { authRouter } from "./auth.route";

const router = Router();

router.use("/auth", authRouter);

export const rootRouter = router;
